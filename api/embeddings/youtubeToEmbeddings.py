from pytube import YouTube
import os
import uuid
import openai
import requests
from datetime import datetime, timedelta
import tiktoken
from nltk import tokenize

"""
1. Download the Video, check availability
2. Get text from video using openai
3. Format the openai response, upload to mongodb
4. Format for Embeddings
5. Generate Embeddings
"""

ENCODER = tiktoken.get_encoding("gpt2")
OPEN_AI_KEY = "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"
openai.api_key = OPEN_AI_KEY
WHISPER_MODEL_NAME = 'whisper-1'




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
            "start": start_time,
            "end": end_time
        })

    return to_return

def srt_to_array(srt_text):
    # Split the SRT text into an array of subtitles
    srt_array = srt_text.strip().split('\n\n')
    subtitles = []

    for s in srt_array:
        # Split each subtitle into its timecodes and text
        s_parts = s.split('\n')
        # Extract start and end timecodes and convert to datetime objects
        start_time = datetime.strptime(s_parts[1].split(' --> ')[0], '%H:%M:%S,%f')
        end_time = datetime.strptime(s_parts[1].split(' --> ')[1], '%H:%M:%S,%f')
        # Calculate start and end times in seconds
        start_time_seconds = (start_time - datetime(1900, 1, 1)).total_seconds()
        end_time_seconds = (end_time - datetime(1900, 1, 1)).total_seconds()
        # Create a dictionary object with start and end times in seconds and text
        subtitle = {'start': start_time_seconds, 'end': end_time_seconds, 'text': s_parts[2]}
        subtitles.append(subtitle)
    return subtitles

def transcribe_file(model_id, path):
    url = 'https://api.openai.com/v1/audio/transcriptions'
    headers = {'Authorization': f'Bearer {OPEN_AI_KEY}'}
    data = {'model': 'whisper-1',}
    files = {
        'file': open(path, 'rb'),
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

def get_video_transcript(url):
    print('#Downloading Video')
    videoFile = download_video(url)
    print('#Video Downloaded')
    transcripts = transcribe_file(WHISPER_MODEL_NAME, videoFile)
    os.remove(videoFile)
    formatted_subtitles = srt_to_array(transcripts)
    print('#Transcripts Generated')
    return formatted_subtitles

def upload_to_weaviate(formatted_transcripts):
    embedding_docs = get_weaviate_docs(formatted_transcripts)

    print('#Downloading Video')
    videoFile = download_video(url)
    print('#Video Downloaded')
    transcripts = transcribe_file(WHISPER_MODEL_NAME, videoFile)
    formatted_subtitles = srt_to_array(transcripts)
    print('#Transcripts Generated')
    return formatted_subtitles


# if __name__ == "__main__":
#     url = "https://www.youtube.com/watch?v=XALBGkjkUPQ"        
#     print('# Downloading Video')
#     videoFile = download_video(url)
#     print('#Video Downloaded')
#     transcripts = transcribe_file(WHISPER_MODEL_NAME, videoFile)
#     os.remove(videoFile)
#     formatted_subtitles = srt_to_array(transcripts)
#     print('#Transcripts Generated')
#     documents = get_weaviate_docs(formatted_subtitles)
#     print('#Documents Generated')
#     print(documents[0])
