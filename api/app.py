from flask import Flask, request, jsonify, g
from api.socket_helper import socketio
from flask_socketio import SocketIO, join_room, leave_room
from http import HTTPStatus
from dotenv import load_dotenv
import fitz
import boto3
import os
import openai
from api.embeddings.main_view import embeddings_bp
from api.summary import get_summary, get_summary_string
from api.utils.utils import require_api_key, get_mongo_client, send_notification_to_client
from api.weaviate_embeddings import get_documents, upload_documents_pdf, get_client, create_pdf_class
from api.utils.aws import get_pdf
from api.socket_helper import send_update
from logging.config import dictConfig
import threading
import nltk
from watchtower import CloudWatchLogHandler
import logging
from api.utils.dataTether import getRedisClient, pushMessageToUser
from uuid import uuid4
load_dotenv()
nltk.download('punkt')



dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
    }},
    'handlers': {'wsgi': {
        'class': 'logging.StreamHandler',
        'stream': 'ext://flask.logging.wsgi_errors_stream',
        'formatter': 'default'
    }},
    'root': {
        'level': 'INFO',
        'handlers': ['wsgi']
    }
})

BUCKET_NAME = 'chimppdfstore'

def create_app():
    load_dotenv()
    app = Flask(__name__)
    app.register_blueprint(embeddings_bp)
    return app

app = create_app()
socketio.init_app(app, cors_allowed_origins="*")
logger = logging.getLogger('myapp')
formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')

def get_s3_client():
    s3 = getattr(g, 's3', None)
    if s3 is None:
        s3 = g.s3 = boto3.client('s3', 
        aws_access_key_id=os.getenv('CB_AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('CB_AWS_SECRET_ACCESS_KEY'),
        region_name=os.getenv('CB_AWS_REGION'))
    return s3
   

def get_open_ai_client():
    openai_g = getattr(g, 'open_ai', None)
    if openai_g is None:
        OPEN_AI_KEY = "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"
        openai.api_key = OPEN_AI_KEY
        openai_g = g.open_ai = openai
    return openai_g


@app.teardown_appcontext
def teardown_mongo_client(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()



@app.route("/")
def index():
    pushMessageToUser("63fce1ef058dde4abc3bbe10", "hello")
    return "<p>Hello, World!</p>"

@app.route("/webook")
def webhook_testing():
    return "test";

@app.route("/lambda_notification", methods=["POST"])
@require_api_key
def generate_pdf_embeddings():
    try:
        data = request.json
        thread = threading.Thread(target=process_pdf_embeddings, args=(data, socketio))
        thread.start()
        return jsonify({"message": "Request accepted, processing in background"}), HTTPStatus.ACCEPTED
    except Exception as e:
        print(e)
        raise e

@app.route('/summaries/', methods=["POST"])
@require_api_key
def generate_summary():
    print('here')
    stream_name = f'stream-name-pdf-summary-{str(uuid4())}'
    new_handler = CloudWatchLogHandler(log_group_name='your-log-group-ashank', log_stream_name=stream_name)
    new_handler.setFormatter(formatter)
    logger.addHandler(new_handler)
    try:
        data = request.json
        pdfKey = data['pdfKey']
        user_id = data['user_id']
        thread = threading.Thread(target=process_summary_pdf, args=(data,stream_name))
        thread.start()
        send_update(socketio, user_id, f'{pdfKey}:summary', {"isSummarizing": True, "summaryJson": {"formattedSummary": []}})

        logger.info(f'Processing PDF summaries for {pdfKey}')
        logger.removeHandler(new_handler)

        return jsonify({"message": "Request accepted, processing in background"}), HTTPStatus.ACCEPTED
    except Exception as e:
        print(e)
        logger.info(f'Error:{e}')
        logger.removeHandler(new_handler)
        raise e

def process_summary_pdf(data,stream_name):
    new_handler = CloudWatchLogHandler(log_group_name='your-log-group-ashank', log_stream_name=stream_name)
    new_handler.setFormatter(formatter)
    logger.addHandler(new_handler)
    try:
        with app.app_context():
            pdfKey = data['pdfKey']
            startPage = int(data['startPage'])
            endPage = int(data['endPage'])
            user_id = data['user_id']
            summaryDict = {}
            summaryDict['startPage'] = startPage
            summaryDict['endPage'] = endPage
            def send_summary_update(latest_summary, isSummarizing=True):
                summaryDict['formattedSummary'] = latest_summary
                send_update(socketio, user_id, f'{pdfKey}:summary', {"isSummarizing": isSummarizing, "summaryJson": summaryDict})
           
            s3 = get_s3_client()
            response = s3.get_object(Bucket=BUCKET_NAME, Key=pdfKey)
            pdf_bytes = response['Body'].read()
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            s = get_summary(doc,startPage, endPage, send_summary_update)
            summaryDict['formattedSummary'] = s
            db_client = get_mongo_client()
            data_db = db_client["data"]
            summariesCollection = data_db["SummaryDocuments"]
            summariesCollection.update_one({"_id": pdfKey}, {"$push": {"summary":  {"$each": [summaryDict], "$position": 0}}})
                        # result = jsonify(s)

            logger.info(f'FINISHED Processing PDF summaries for {pdfKey}')
            logger.removeHandler(new_handler)
            send_summary_update(s, False)
            # return result
    except Exception as e:
        print(e)
        logger.info(f'Error:{e}')
        logger.removeHandler(new_handler)
        raise e

def process_pdf_embeddings(data, socketio_instance):
    try:
        with app.app_context():
            bucket = data['bucket']
            key = data['key']
            print(f'Started EMBEDDINGS for - {key}')
            user_id = data['user_id']
            send_notification_to_client(user_id, key, f'Upload complete for:{key}')
            pdf = get_pdf(bucket, key)            
            documents = get_documents(pdf)
            client = get_client()
            class_name = create_pdf_class(key, client)
            upload_documents_pdf(documents, client, class_name)
            print('UPLOADED DOCUMENTS')
            send_update(socketio_instance, user_id, key,  {'key': 'isReady', 'value': True})
            print(f'FINISHED EMBEDDINGS for - {key}')
    except Exception as e:
        print(e)

@app.route('/summaries/websites/', methods=["POST"])
@require_api_key
def generate_summary_websites():
    stream_name = f'stream-name-website-summary-{str(uuid4())}'
    new_handler = CloudWatchLogHandler(log_group_name='your-log-group-ashank', log_stream_name=stream_name)
    new_handler.setFormatter(formatter)
    logger.addHandler(new_handler)
    try:
        data = request.json
        key = data['key']
        user_id = data['user_id']
        thread = threading.Thread(target=process_summary_websites, args=(data,stream_name))
        thread.start()
        send_update(socketio, user_id, f'{key}:summary', {"isSummarizing": True, "summaryJson": {"formattedSummary": []}})

        logger.info(f'Processing website summary for {key}')
        logger.removeHandler(new_handler)

        return jsonify({"message": "Request accepted, processing in background"}), HTTPStatus.ACCEPTED
    except Exception as e:
        print(e)
        logger.info(f'Error:{e}')
        logger.removeHandler(new_handler)
        raise e

def process_summary_websites(data,stream_name):
    new_handler = CloudWatchLogHandler(log_group_name='your-log-group-ashank', log_stream_name=stream_name)
    new_handler.setFormatter(formatter)
    logger.addHandler(new_handler)
    try:
        with app.app_context():
            key = data['key']
            user_id = data['user_id']
            summaryDict = {}
            summaryDict['startPage'] = -1
            summaryDict['endPage'] = -1
            
            def send_summary_update(latest_summary, isSummarizing=True):
                summaryDict['formattedSummary'] = latest_summary
                send_update(socketio, user_id, f'{key}:summary', {"isSummarizing": isSummarizing, "summaryJson": summaryDict})
           
            db_client = get_mongo_client()
            data_db = db_client["data"]
            websites_collection = data_db["SummaryWebsites"]
            website_doc = websites_collection.find_one({'_id': key})
            website_text = website_doc['content']
            s = get_summary_string(website_text, send_summary_update)
            summaryDict['formattedSummary'] = s
            websites_collection.update_one({"_id": key}, {"$push": {"summary":  {"$each": [summaryDict], "$position": 0}}})

            # result = jsonify(s)
            send_notification_to_client(user_id, key, f'Summary complete for:{key}')
            send_summary_update(s, False)   

            logger.info(f'FINISHED Processing website summaries for {key}')
            logger.removeHandler(new_handler)
            # return result
    except Exception as e:
        print(e)
        logger.info(f'Error:{e}')
        logger.removeHandler(new_handler)
        raise e

@app.route('/summaries/youtube/', methods=["POST"])
@require_api_key
def generate_summary_youtube():
    stream_name = f'stream-name-youtube-summary-{str(uuid4())}'
    new_handler = CloudWatchLogHandler(log_group_name='your-log-group-ashank', log_stream_name=stream_name)
    new_handler.setFormatter(formatter)
    logger.addHandler(new_handler)
    try:
        data = request.json
        key = data['key']
        user_id = data['user_id']
        thread = threading.Thread(target=process_summary_youtube, args=(data,stream_name))
        thread.start()
        send_update(socketio, user_id, f'{key}:summary', {"isSummarizing": True, "summaryJson": {"formattedSummary": []}})

        logger.info(f'Processing youtube summary for {key}')
        logger.removeHandler(new_handler)

        return jsonify({"message": "Request accepted, processing in background"}), HTTPStatus.ACCEPTED
    except Exception as e:
        print(e)
        logger.info(f'Error:{e}')
        logger.removeHandler(new_handler)
        raise e

def process_summary_youtube(data,stream_name):
    new_handler = CloudWatchLogHandler(log_group_name='your-log-group-ashank', log_stream_name=stream_name)
    new_handler.setFormatter(formatter)
    logger.addHandler(new_handler)
    try:
        with app.app_context():
            key = data['key']
            summaryDict = {}
            summaryDict['startPage'] = -1
            summaryDict['endPage'] = -1
            user_id = data['user_id']

            def send_summary_update(latest_summary, isSummarizing=True):
                summaryDict['formattedSummary'] = latest_summary
                send_update(socketio, user_id, f'{key}:summary', {"isSummarizing": isSummarizing, "summaryJson": summaryDict})
            
            
            db_client = get_mongo_client()
            data_db = db_client["data"]
            video_collection = data_db["SummaryYoutube"]
            video_doc = video_collection.find_one({'_id': key})
            video_text = [t["text"] for t in video_doc['transcript']]
            s = get_summary_string(video_text, send_summary_update)
            
            summaryDict['formattedSummary'] = s
            video_collection.update_one({"_id": key}, {"$push": {"summary":  {"$each": [summaryDict], "$position": 0}}})
            # result = jsonify(s)
            send_summary_update(s, False)
            logger.info(f'FINISHED Processing video summaries for {key}')
            # return result
    except Exception as e:
        print(e)
        logger.info(f'Error:{e}')
        logger.removeHandler(new_handler)
        raise e



if __name__ =="__main__":
    socketio.run(app, host='0.0.0.0', debug=True)



def join_user_room(user_id):
    room = user_id
    join_room(room)
    print(f"Joined room: {room}")  # Add this print statement
    return room

def leave_user_room(user_id):
    room = user_id
    leave_room(room)
    return room

# Use the token or user_id you receive from the Next.js frontend
@socketio.on('join')
def on_join(data):
    user_id = data['userId']
    print(f'New Connection: {user_id}')
    join_user_room(user_id)
    send_update(socketio, user_id, 'user_update', {'msg': 'This Works'})

@socketio.on('leave')
def on_leave(data):
    user_id = data['userId']
    print(f'Closing Connection: {user_id}')
    leave_user_room(user_id)