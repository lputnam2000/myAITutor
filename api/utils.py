from functools import wraps
from flask import request, jsonify, g
import os
import pymongo

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