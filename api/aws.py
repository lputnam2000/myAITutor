import boto3
from botocore.config import Config
import os
from dotenv import load_dotenv
load_dotenv()

BUCKET_NAME = 'chimppdfstore'
KEY = '68e53dbd-ca41-44e7-92d7-f8959225e4d8'

def get_s3_client():
    return boto3.client('s3', 
        aws_access_key_id=os.getenv('CB_AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('CB_AWS_SECRET_ACCESS_KEY'),
        region_name=os.getenv('CB_AWS_REGION'))


def get_pdf(key:str):
    s3 = get_s3_client()
    response = s3.get_object(Bucket=BUCKET_NAME, Key=KEY)
    return response['Body'].read()