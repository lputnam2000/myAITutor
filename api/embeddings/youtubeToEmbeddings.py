from pytube import YouTube
from api.utils.utils import  get_mongo_client, send_notification_to_client
from .websiteToEmbeddings import get_client, create_class, upload_documents
from api.weaviate_embeddings import create_youtube_class, upload_documents_youtube
from api.utils.aws import get_video_file, upload_video_thumbnail
from moviepy.editor import *
from moviepy.video.io.VideoFileClip import VideoFileClip
import math
from pydub import AudioSegment
from flask import current_app
import logging
from watchtower import CloudWatchLogHandler
import os
import uuid
import openai
import requests
from datetime import datetime, timedelta
import tiktoken
from nltk import tokenize
from ..socket_helper import send_update
import multiprocessing
from functools import partial


"""
1. Download the Video, check availability
2. Get text from video using openai
3. Format the openai response, upload to mongodb
4. Format for Embeddings
5. Generate Embeddings
"""

FORMATTER = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
ENCODER = tiktoken.get_encoding("gpt2")
OPEN_AI_KEY = "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"
openai.api_key = OPEN_AI_KEY
WHISPER_MODEL_NAME = 'whisper-1'
CHUNKS_SIZE = 25 * 60 * 1000  # 25 minutes in milliseconds


def get_weaviate_docs(transcripts):
    tracripts_string = [t["text"] for t in transcripts]
    encodings = ENCODER.encode_batch(tracripts_string)
    to_return = []

    i = 0
    while i < len(encodings):
        doc_length = len(encodings[i])
        doc_text = tracripts_string[i]
        start_time = transcripts[i]["start"]
        
        while doc_length < 300 and i+1 < len(encodings):
            i += 1
            doc_length += len(encodings[i]) 
            doc_text += ' ' + tracripts_string[i]
        
        end_time = transcripts[i]["end"]
        i += 1

        to_return.append({
            "text": doc_text,
            "start_time": start_time,
            "end_time": end_time
        })

    return to_return

def srt_to_array(arrays_of_srt_text):
    # Split the SRT text into an array of subtitles
    subtitles = []
    for i, srt_text in enumerate(arrays_of_srt_text):
        srt_array = srt_text.strip().split('\n\n')

        for s in srt_array:
            # Split each subtitle into its timecodes and text
            s_parts = s.split('\n')
            # Extract start and end timecodes and convert to datetime objects
            start_time = datetime.strptime(s_parts[1].split(' --> ')[0], '%H:%M:%S,%f')
            end_time = datetime.strptime(s_parts[1].split(' --> ')[1], '%H:%M:%S,%f')
            # Add offset to start and end times:
            start_time += timedelta(milliseconds=CHUNKS_SIZE*i)
            end_time += timedelta(milliseconds=CHUNKS_SIZE*i)
            # Calculate start and end times in seconds
            start_time_seconds = (start_time - datetime(1900, 1, 1)).total_seconds()
            end_time_seconds = (end_time - datetime(1900, 1, 1)).total_seconds()
            # Create a dictionary object with start and end times in seconds and text
            subtitle = {'start': start_time_seconds, 'end': end_time_seconds, 'text': s_parts[2]}
            subtitles.append(subtitle)
    return subtitles

def batch_transcribe_file(model_id, path):
    # Split audio file into chunks
    print(path)
    audio = AudioSegment.from_file(path)
    segments = []
    for i in range(0, len(audio), CHUNKS_SIZE):
        segment = audio[i:i+CHUNKS_SIZE]
        segments.append(segment)

    pool = multiprocessing.Pool()
    transcribe_func = partial(transcribe_file, model_id)
    transcripts = pool.map(transcribe_func, [(i, segment, path) for i, segment in enumerate(segments)])
    pool.close()
    pool.join()
    return transcripts  

def transcribe_file(model_id, segment_info):
    i, segment, path = segment_info
    segment_path = f"{path}_{i}.mp3"
    segment.export(segment_path, format="mp3", tags={"timecode": str(i*CHUNKS_SIZE)})
    url = 'https://api.openai.com/v1/audio/translations'
    headers = {'Authorization': f'Bearer {OPEN_AI_KEY}'}
    data = {'model': 'whisper-1',}
    with open(segment_path, 'rb') as f:
        files = {
            'file': f,
            'model': (None, 'whisper-1'),
            'response_format': (None, 'srt')
        }
        response = requests.post(url, headers=headers, files=files)
    if response.ok:
        return response.text
    else:
        # import pdb
        # pdb.set_trace()
        print(response.content.decode())
        raise ValueError(f"Request failed with status code {response.status_code}.")



def download_video(vidLink):
    try:
        vidObj = YouTube(vidLink)
        vidObj.check_availability()
    except Exception as e:
        print(e)
        return "vid not available"
    vidStreams = vidObj.streams.filter(only_audio=True)[0]
    if not vidStreams:
        return "no streams availables"   
    file_name = uuid.uuid4().__str__()
    outFile = vidStreams.download(output_path='audio')
    base, ext = os.path.splitext(outFile)
    newFile = file_name + '.mp3'
    os.rename(outFile, newFile)
    return newFile

def get_video_transcript(url, isMP4, send_progress_update):
    print('#Downloading Video')
    videoFile = ''
    if isMP4:
        send_progress_update(0, 'Watching the Video! ▶️🦍🍌')

        # convert to s3
        videoFileMP3 = f'{url}.mp3'
        video = VideoFileClip(url)
        audio = video.audio
        audio.write_audiofile(videoFileMP3)
        video.close()
        audio.close()

        # delete mp4
        os.remove(url)
        videoFile = videoFileMP3
    else:
        send_progress_update(0, 'Browsing Youtube! ▶️🦍🍌')
        videoFile = download_video(url)
    print('#Video Downloaded')
    send_progress_update(15, 'Translating hooman-speak to prime chimp-lingo! 👫➡️🦍')
    transcripts = batch_transcribe_file(WHISPER_MODEL_NAME, videoFile)
    os.remove(videoFile)
    print(transcripts)
    formatted_subtitles = srt_to_array(transcripts)
    print('#Transcripts Generated')
    return formatted_subtitles

def create_thumbnail(bucket, key):
    videoFile = get_video_file(bucket,key)
    clip = VideoFileClip(videoFile)
    thumbnail = clip.get_frame(0)
    upload_video_thumbnail(thumbnail,key)
    return videoFile

if __name__ == "__main__":
    url = "https://www.youtube.com/watch?v=XALBGkjkUPQ"        
    print('# Downloading Video')
    videoFile = download_video(url)
    print('#Video Downloaded')
    transcripts = transcribe_file(WHISPER_MODEL_NAME, videoFile)
    os.remove(videoFile)
    formatted_subtitles = srt_to_array(transcripts)
    print('#Transcripts Generated')

def process_mp4_embeddings(data, stream_name):
    new_handler = CloudWatchLogHandler(log_group_name='your-log-group-ashank', log_stream_name=stream_name)
    new_handler.setFormatter(FORMATTER)
    current_app.logger.addHandler(new_handler)
    try:
        isMP4 = True
        bucket = data['bucket']
        key = data['key']
        print(f'1. Downloading VIDEO for - {key}')
        current_app.logger.info(f'1. Downloading VIDEO for - {key}')
        user_id = data['user_id']
        
        def send_progress_update(value, text):
            send_update( user_id, f'{key}:progress',  {'value': value, 'text': text})

        print(f'CREATING THUMBNAIL FOR: {key}')
        videoFile = create_thumbnail(bucket, key)
        #TODO: send socket notification to client that thumbnail is done

        print(f'1. PROCESSING REQ IN THREAD: {key}')
        current_app.logger.info(f'1. PROCESSING REQ IN THREAD: {key}')
        formatted_subtitles = get_video_transcript(videoFile, isMP4, send_progress_update)
        print(formatted_subtitles)
        documents = get_weaviate_docs(formatted_subtitles)
        print('2. PARSED DOCUMENTS')
        current_app.logger.info('2. PARSED DOCUMENTS')
        client = get_client()
        class_name = create_youtube_class(key, client)
        print(f'3. CREATED CLASS {class_name}')
        current_app.logger.info(f'3. CREATED CLASS {class_name}')
        send_progress_update(40, "Making Notes! 📝🦍")
        upload_documents_youtube(documents, client, class_name, send_progress_update)
        print("4. UPLOADED DOCUMENTS")
        current_app.logger.info("4. UPLOADED DOCUMENTS")
        send_progress_update(99, "Finishing Up! 💪🦍")
        db_client = get_mongo_client()
        data_db = db_client["data"]
        youtube_collection = data_db["SummaryVideos"]
        update_query = {"$set": {"status": "Ready", "transcript": formatted_subtitles}}
        # Update the document matching the UUID with the new values
        youtube_collection.update_one({"_id": key}, update_query)
        send_update( user_id, key,  {'key': 'isReady', 'value': True})
        # send_notification_to_client(user_id, key, f'Embeddings complete for:{key}')
        current_app.logger.removeHandler(new_handler)
    except Exception as e:
        print(e)
        current_app.logger.info(f'Error:{e}')
        current_app.logger.removeHandler(new_handler)
        raise e

def process_youtube_embeddings(data, stream_name):
    new_handler = CloudWatchLogHandler(log_group_name='your-log-group-ashank', log_stream_name=stream_name)
    new_handler.setFormatter(FORMATTER)
    current_app.logger.addHandler(new_handler)
    try:
        url = data['url']
        user_id = data['user_id']
        key = data['key']
        def send_progress_update(value, text):
            send_update( user_id, f'{key}:progress',  {'value': value, 'text': text})

        print(f'1. PROCESSING REQ IN THREAD: {key}')
        current_app.logger.info(f'1. PROCESSING REQ IN THREAD: {key}')
        formatted_subtitles = get_video_transcript(url, False, send_progress_update)
        documents = get_weaviate_docs(formatted_subtitles)
        print('2. PARSED DOCUMENTS')
        current_app.logger.info('2. PARSED DOCUMENTS')
        client = get_client()
        class_name = create_youtube_class(key, client)
        send_progress_update(40, "Making Notes! 📝🦍")
        print(f'3. CREATED CLASS {class_name}')
        current_app.logger.info(f'3. CREATED CLASS {class_name}')
        upload_documents_youtube(documents, client, class_name, send_progress_update)
        print("4. UPLOADED DOCUMENTS")
        current_app.logger.info("4. UPLOADED DOCUMENTS")
        send_progress_update(99, "Finishing Up! 💪🦍")
        db_client = get_mongo_client()
        data_db = db_client["data"]
        youtube_collection = data_db["SummaryYoutube"]
        update_query = {"$set": {"status": "Ready", "transcript": formatted_subtitles}}
        # Update the document matching the UUID with the new values
        youtube_collection.update_one({"_id": key}, update_query)
        send_update( user_id, key,  {'key': 'isReady', 'value': True})
        # send_notification_to_client(user_id, key, f'Embeddings complete for:{key}')
        current_app.logger.removeHandler(new_handler)
    except Exception as e:
        print(e)
        current_app.logger.info(f'Error:{e}')
        current_app.logger.removeHandler(new_handler)
        raise e