from flask import Flask, request, jsonify, g
from http import HTTPStatus
from dotenv import load_dotenv
import fitz
import boto3
import os
import openai
from api.embeddings.main_view import embeddings_bp
from api.summary import get_summary, get_summary_string
from api.utils.utils import require_api_key, get_mongo_client, send_notification_to_client
from api.weaviate_embeddings import get_documents, upload_documents, get_client, create_class
from api.utils.aws import get_pdf
from logging.config import dictConfig
import nltk
# load_dotenv()
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
    return "<p>Hello, World!</p>"

@app.route("/webook")
def webhook_testing():
    return "test";

@app.route("/lambda_notification", methods=["POST"])
@require_api_key
def generate_pdf_embeddings():
    # get documents
    data = request.json
    bucket = data['bucket']
    key = data['key']
    user_id = data['user_id']
    # TODO: Put this in lambda
    send_notification_to_client(user_id, key, f'Upload complete for:{key}')
    pdf = get_pdf(bucket, key)
    documents = get_documents(pdf)
    client = get_client()
    class_name = create_class(key, client)
    upload_documents(documents, client, class_name)
    send_notification_to_client(user_id, key, f'Embeddings complete for:{key}')
    return jsonify({"message": "Embeddings Uploaded"}), HTTPStatus.OK



@app.route('/summaries/', methods=["POST"])
@require_api_key
def generate_summary():
    print('here')
    data = request.json# .data is empty
    pdfKey = data['pdfKey']
    startPage = int(data['startPage'])
    endPage = int(data['endPage'])
    user_id = data['user_id']

    s3 = get_s3_client()
    response = s3.get_object(Bucket=BUCKET_NAME, Key=pdfKey)
    pdf_bytes = response['Body'].read()
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    s = get_summary(doc,startPage, endPage)
    print(s)
    db_client = get_mongo_client()
    data_db = db_client["data"]
    summariesCollection = data_db["SummaryDocuments"]
    summaryDict = {}
    summaryDict['startPage'] = startPage
    summaryDict['endPage'] = endPage
    summaryDict['formattedSummary'] = s
    summariesCollection.update_one({"_id": pdfKey}, {"$push": {"summary": summaryDict}})
    result = jsonify(s)
    send_notification_to_client(user_id, pdfKey, f'Summary complete for:{pdfKey}')
    return result

@app.route('/summaries/websites/', methods=["POST"])
@require_api_key
def generate_summary_websites():
    data = request.json #.data is empty
    key = data['key']
    user_id = data['user_id']
    db_client = get_mongo_client()
    data_db = db_client["data"]
    websites_collection = data_db["SummaryWebsites"]
    website_doc = websites_collection.find_one({'_id': key})
    website_text = website_doc['documents']
    s = get_summary_string(website_text)
    summaryDict = {}
    summaryDict['startPage'] = -1
    summaryDict['endPage'] = -1
    summaryDict['formattedSummary'] = s
    websites_collection.update_one({"_id": key}, {"$push": {"summary": summaryDict}})
    result = jsonify(s)
    send_notification_to_client(user_id, key, f'Summary complete for:{key}')
    return result

@app.route('/summaries/youtube/', methods=["POST"])
@require_api_key
def generate_summary_youtube():
    data = request.json #.data is empty
    key = data['key']
    user_id = data['user_id']
    db_client = get_mongo_client()
    data_db = db_client["data"]
    video_collection = data_db["SummaryYoutube"]
    video_doc = video_collection.find_one({'_id': key})
    video_text = [t["text"] for t in video_doc['transcript']]
    s = get_summary_string(video_text)
    summaryDict = {}
    summaryDict['startPage'] = -1
    summaryDict['endPage'] = -1
    summaryDict['formattedSummary'] = s
    video_collection.update_one({"_id": key}, {"$push": {"summary": summaryDict}})
    result = jsonify(s)
    send_notification_to_client(user_id, key, f'Summary complete for:{key}')
    return result


if __name__ =="__main__":
    app.run(host='0.0.0.0', debug=True)