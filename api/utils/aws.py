import boto3
from botocore.config import Config
import os
from dotenv import load_dotenv
import fitz
import io
load_dotenv()

# BUCKET_NAME = 'chimppdfstore'
# KEY = '00db103d-82d6-4e02-852e-4f9164fc9ae9'

def get_s3_client():
    return boto3.client('s3', 
        aws_access_key_id=os.getenv('CB_AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('CB_AWS_SECRET_ACCESS_KEY'),
        region_name=os.getenv('CB_AWS_REGION'))


def get_pdf(bucket, key):
    s3 = get_s3_client()
    response = s3.get_object(Bucket=bucket, Key=key)
    content = response['Body'].read()
    doc = fitz.open(stream=io.BytesIO(content))
    return doc
    # for p in doc:
    #     text = p.get_text().encode("utf8")
    #     print(text)
    #     break
    # return response['Body'].read()

# # print(get_pdf("l"))
# get_pdf("l")