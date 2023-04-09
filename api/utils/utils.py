from functools import wraps
from flask import request, jsonify, g
import os
import pymongo
import redis
from dotenv import load_dotenv
# load_dotenv()


def get_redis_client():
    r = redis.Redis(
  host='redis-18322.c8.us-east-1-2.ec2.cloud.redislabs.com',
  port=18322,
  password='Pq31scfJnfOzfmoJwnOx0tFpUdli98jM')
    
    return r

def send_notification_to_client(user_id, document_key, message):
    print(f"Sending Redis Notification for:{user_id}:{document_key}")
    redis_client = get_redis_client()
    channel = f'chimpbase:user:{user_id}'

    # message = f'Embeddings complete for:{document_key}'

    redis_client.publish(channel, message)


def require_api_key(view_function):
    @wraps(view_function)
    def decorated_function(*args, **kwargs):
        api_key = request.headers.get('X-API-Key')
        if not api_key:
            api_key = request.args.get('api_key')
        if not api_key:
            return jsonify({'error': 'API key is missing'}), 401
        if api_key == os.getenv('CB_API_SECRET'):
            return view_function(*args, **kwargs)
    return decorated_function

def get_mongo_client():
    db = getattr(g, 'db', None)
    if db is None:
        db = g.db = pymongo.MongoClient(os.getenv('MONGODB_URI'))
    return db

def update_mongo_progress(data_db, user_id, key, progress, progressMessage, collectionType):
    result1 = data_db.UserUploads.update_one(
        {"userid": user_id, "uploads.uuid": key},
        {"$set": {"uploads.$.progress": progress}},
    )
    result2 = data_db[collectionType].update_one(
        {"_id": key},
        {"$set": {"progress": progress, "progressMessage": progressMessage}},
    )

def update_mongo_summary(data_db, key, summaryDict, collectionType, isSummarizing):
    if isSummarizing:
        result2 = data_db[collectionType].update_one(
            {"_id": key},
            {"$set": {"liveSummary": summaryDict}},
        )

    else:
        result2 = data_db[collectionType].update_one(
            {"_id": key},
            {"$set": {"liveSummary": {}}},
        )
        result2 = data_db[collectionType].update_one(
            {"_id": key},
            {"$push": {"summary":  {"$each": [summaryDict], "$position": 0}}},
        )