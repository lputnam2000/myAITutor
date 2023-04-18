import boto3
from botocore.config import Config
import os
from dotenv import load_dotenv
import fitz
import io
import uuid
from PIL import Image
load_dotenv()

# BUCKET_NAME = 'chimppdfstore'
# KEY = '00db103d-82d6-4e02-852e-4f9164fc9ae9'

def get_s3_client():
    return boto3.client('s3', 
        aws_access_key_id=os.getenv('CB_AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('CB_AWS_SECRET_ACCESS_KEY'),
        region_name=os.getenv('CB_AWS_REGION'))

def get_video_file(bucket, key):
    file_name = uuid.uuid4().__str__()
    s3 = get_s3_client()
    s3.download_file(bucket, key, f'{file_name}.mp4')
    return f'{file_name}.mp4'

def upload_video_thumbnail(thumbnail, key):
    bucket_name_imgs = "videouploads-thumbnails"
    
    # get bytes for thumbnail
    pil_image = Image.fromarray(thumbnail)
    bytes_io = io.BytesIO()
    pil_image.save(bytes_io, format='JPEG')
    thumbnail_bytes = bytes_io.getvalue()

    # Upload the thumbnail image to the S3 bucket
    s3 = get_s3_client()
    s3.put_object(Bucket=bucket_name_imgs, Key=key, Body=thumbnail_bytes)


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