from flask import Flask, request, jsonify
from http import HTTPStatus
from pypdf import PdfReader
from dotenv import load_dotenv
import io
import fitz
import boto3
from botocore.config import Config
import os
import pymongo
import openai
from flask import g
from summary import get_summary

def create_app():
    load_dotenv()
    app = Flask(__name__)
    return app

app = create_app()

BUCKET_NAME = 'chimppdfstore'

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

def get_mongo_client():
    db = getattr(g, 'db', None)
    if db is None:
        db = g.db = pymongo.MongoClient(os.getenv('MONGODB_URI'))
    return db

@app.teardown_appcontext
def teardown_mongo_client(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()



@app.route("/")
def index():
    return "<p>Hello, World!</p>"


@app.route('/summaries/', methods=["POST"])
def generate_summary():
    data = request.json  # data is empty
    print(data)
    pdfKey = data['pdfKey']
    startPage = int(data['startPage'])
    endPage = int(data['endPage'])

    s3 = get_s3_client()
    response = s3.get_object(Bucket=BUCKET_NAME, Key=pdfKey)
    pdf_bytes = response['Body'].read()
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    s = get_summary(doc,startPage, endPage)
    db_client = get_mongo_client()
    data_db = db_client["data"]
    summariesCollection = data_db["SummaryDocuments"]
    summaryDict = {}
    summaryDict['startPage'] = startPage
    summaryDict['endPage'] = endPage
    summaryDict['formattedSummary'] = s
    summariesCollection.update_one({"_id": pdfKey}, {"$push": {"summary": summaryDict}})

    return jsonify(s)

