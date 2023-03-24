from http import HTTPStatus
from flask import Flask, Blueprint, jsonify, request, copy_current_request_context
from ..utils.utils import require_api_key
from .websiteToEmbeddings import process_web_embeddings, process_chrome_extension_embeddings, process_web_text
from .youtubeToEmbeddings import process_youtube_embeddings
from uuid import uuid4
import threading

embeddings_bp = Blueprint('embeddings', __name__, url_prefix='/embeddings')

@embeddings_bp.route('/websites/', methods=['POST'])
@require_api_key
def website_to_embedding():
    try:
        data = request.json
        @copy_current_request_context
        def run_in_context(data, function):
            print("test")
            function(data)

        thread_embeddings = threading.Thread(target=run_in_context, args=(data,process_web_embeddings))
        thread_embeddings.start()

        thread_text = threading.Thread(target=run_in_context, args=(data,process_web_text))
        thread_text.start()
        return jsonify({"message": "Request accepted, processing in background"}), HTTPStatus.ACCEPTED
    except Exception as e:
        print(e)
        raise e

@embeddings_bp.route('/extension/', methods=['POST'])
@require_api_key
def extension_to_embedding():
    try:
        data = request.json
        @copy_current_request_context
        def run_in_context(data, function):
            print("test")
            function(data)

        thread = threading.Thread(target=run_in_context, args=(data,process_chrome_extension_embeddings))
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
        @copy_current_request_context
        def run_in_context(data, function):
            print("test")
            function(data)
        thread = threading.Thread(target=run_in_context, args=(data,process_youtube_embeddings))
        thread.start()
        return jsonify({"message": "Request accepted, processing in background"}), HTTPStatus.ACCEPTED

    except Exception as e:
        print(e)
        raise e