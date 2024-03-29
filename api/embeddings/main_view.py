from http import HTTPStatus
from flask import Flask, Blueprint, jsonify, request, copy_current_request_context, current_app
from api.utils.utils import require_api_key
from .websiteToEmbeddings import process_web_embeddings,  process_chrome_extension_text, process_chrome_extension_embeddings, process_web_text
from .youtubeToEmbeddings import process_youtube_embeddings
from uuid import uuid4
from watchtower import CloudWatchLogHandler
import logging
import threading
from ..socket_helper import send_update

embeddings_bp = Blueprint('embeddings', __name__, url_prefix='/embeddings')
# logger = logging.getLogger('myapp-blueprint')
formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')

@embeddings_bp.route('/websites/', methods=['POST'])
@require_api_key
def website_to_embedding():
    stream_name = f'stream-name-website-embeddings-{str(uuid4())}'
    new_handler = CloudWatchLogHandler(log_group_name='your-log-group-ashank', log_stream_name=stream_name)
    new_handler.setFormatter(formatter)
    current_app.logger.addHandler(new_handler)
    try:
        data = request.json
        key = data['key']
        @copy_current_request_context
        def run_in_context(data, function, stream_name):
            function(data, stream_name)

        thread_embeddings = threading.Thread(target=run_in_context, args=(data, process_web_embeddings, stream_name))
        thread_embeddings.start()
        current_app.logger.info(f'Processing website embeddings for {key}')



        thread_text = threading.Thread(target=run_in_context, args=(data, process_web_text, stream_name))
        thread_text.start()
        current_app.logger.info(f'Processing website text for {key}')

        current_app.logger.removeHandler(new_handler)
        return jsonify({"message": "Request accepted, processing in background"}), HTTPStatus.ACCEPTED
    except Exception as e:
        print(e)
        current_app.logger.info(f'Error:{e}')
        current_app.logger.removeHandler(new_handler)
        raise e

@embeddings_bp.route('/extension/', methods=['POST'])
@require_api_key
def extension_to_embedding():
    stream_name = f'stream-name-extension-embeddings-{str(uuid4())}'
    new_handler = CloudWatchLogHandler(log_group_name='your-log-group-ashank', log_stream_name=stream_name)
    new_handler.setFormatter(formatter)
    current_app.logger.addHandler(new_handler)
    try:
        data = request.json
        @copy_current_request_context
        def run_in_context(data, function, stream_name):
            function(data, stream_name)
        user_id = data['user_id']
        key = data['key']
        new_upload = {
            'uuid': user_id,
            'title': data['title'],
            'status': 'Not Ready',
            'type': 'url'
        }
        print('Staring new chrome embeddings')
        send_update( user_id, 'home', {'type':'new_upload', 'value': new_upload})

        thread = threading.Thread(target=run_in_context, args=(data,process_chrome_extension_embeddings, stream_name))
        thread.start()

        key = data['key']
        thread_text = threading.Thread(target=run_in_context, args=(data, process_chrome_extension_text, stream_name))
        thread_text.start()
        current_app.logger.info(f'Processing website text for {key}')

        current_app.logger.info(f'Processing extension embeddings for {key}')
        current_app.logger.removeHandler(new_handler)

        return jsonify({"message": "Request accepted, processing in background"}), HTTPStatus.ACCEPTED

    except Exception as e:
        print(e)
        current_app.logger.info(f'Error:{e}')
        current_app.logger.removeHandler(new_handler)
        raise e

@embeddings_bp.route('/youtube_video/', methods=['POST'])
@require_api_key
def video_to_embedding():
    stream_name = f'stream-name-video-embeddings-{str(uuid4())}'
    new_handler = CloudWatchLogHandler(log_group_name='your-log-group-ashank', log_stream_name=stream_name)
    new_handler.setFormatter(formatter)
    current_app.logger.addHandler(new_handler)
    try:
        data = request.json        
        @copy_current_request_context
        def run_in_context(data, function, stream_name):
            function(data, stream_name)

        thread = threading.Thread(target=run_in_context, args=(data,process_youtube_embeddings, stream_name))
        key = data['key']

        thread.start()

        current_app.logger.info(f'Processing video embeddings for {key}')
        current_app.logger.removeHandler(new_handler)

        return jsonify({"message": "Request accepted, processing in background"}), HTTPStatus.ACCEPTED

    except Exception as e:
        print(e)
        current_app.logger.info(f'Error:{e}')
        current_app.logger.removeHandler(new_handler)
        raise e