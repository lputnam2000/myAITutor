from http import HTTPStatus
from flask import Flask, Blueprint, jsonify, request
from ..utils.utils import require_api_key
from .websiteToEmbeddings import process_web_embeddings, process_chrome_extension_embeddings
from .youtubeToEmbeddings import process_youtube_embeddings
from uuid import uuid4
import threading

embeddings_bp = Blueprint('embeddings', __name__, url_prefix='/embeddings')

@embeddings_bp.route('/websites/', methods=['POST'])
@require_api_key
def website_to_embedding():
    try:
        data = request.json
        thread = threading.Thread(target=process_web_embeddings, args=(data,))
        thread.start()
        return jsonify({"message": "Request accepted, processing in background"}), HTTPStatus.ACCEPTED
    except Exception as e:
        print(e)
        raise e

@embeddings_bp.route('/extension/', methods=['POST'])
@require_api_key
def extension_to_embedding():
    try:
        data = request.json
        thread = threading.Thread(target=process_chrome_extension_embeddings, args=(data,))
        thread.start()
        return jsonify({"message": "Request accepted, processing in background"}), HTTPStatus.ACCEPTED

    except Exception as e:
        print(e)
        raise e

@embeddings_bp.route('/youtube_video/', methods=['POST'])
@require_api_key
def video_to_embedding():
    try:
        data = request.json
        thread = threading.Thread(target=process_youtube_embeddings, args=(data,))
        thread.start()
        return jsonify({"message": "Request accepted, processing in background"}), HTTPStatus.ACCEPTED

    except Exception as e:
        print(e)
        raise e