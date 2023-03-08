from http import HTTPStatus
from flask import Flask, Blueprint, jsonify, request
from ..utils.utils import require_api_key, get_mongo_client, send_notification_to_client
# from api.utils import require_api_key, get_mongo_client, send_notification_to_client
from .websiteToEmbeddings import get_documents, get_client, create_class, upload_documents
from .youtubeToEmbeddings import get_video_transcript, get_weaviate_docs

embeddings_bp = Blueprint('embeddings', __name__, url_prefix='/embeddings')

@embeddings_bp.route('/websites/', methods=['POST'])
@require_api_key
def website_to_embedding():
    print("test")
    try:
        data = request.json # .data is empty
        url = data['url']
        key = data['key']
        user_id = data['user_id']
        documents = get_documents(url)
        print('#PARSED DOCUMENTS')
        client = get_client()
        class_name = create_class(key, client)
        print(f'#CREATED CLASS {class_name}')
        upload_documents(documents, client, class_name)
        print("#UPLOADED DOCUMENTS")
        db_client = get_mongo_client()
        data_db = db_client["data"]
        websitesCollection = data_db["SummaryWebsites"]
        update_query = {"$set": {"status": "Ready", "documents": documents}}
        # Update the document matching the UUID with the new values
        websitesCollection.update_one({"_id": key}, update_query)
        send_notification_to_client(user_id, key, f'Embeddings complete for:{key}')
        return jsonify({"message": "Embeddings Uploaded"}), HTTPStatus.OK
    except Exception as e:
        print(e)
        raise e
    
@embeddings_bp.route('/youtube_video/', methods=['POST'])
@require_api_key
def youtube_to_embedding():
    try:
        data = request.json # .data is empty
        url = data['url']
        key = data['key']
        formatted_subtitles = get_video_transcript(url)
        db_client = get_mongo_client()
        data_db = db_client["data"]
        youtube_collection = data_db["SummaryYoutube"]
        update_query = {"$set": {"status": "Ready", "transcript": formatted_subtitles}}
        # Update the document matching the UUID with the new values
        youtube_collection.update_one({"_id": key}, update_query)
        documents = get_weaviate_docs(formatted_subtitles)
        print('#PARSED DOCUMENTS')
        client = get_client()
        class_name = create_class(key, client)
        print(f'#CREATED CLASS {class_name}')
        upload_documents(documents, client, class_name)
        print("#UPLOADED DOCUMENTS")
        return jsonify({"message": "Embaddings Uploaded"}), HTTPStatus.OK
        """
        1. Download the Video, check availability
        2. Get text from video using openai
        3. Format the openai response, upload to mongodb
        4. Format for Embeddings
        5. Generate Embeddings
        """
        # documents = get_documents(url)
        # print('#PARSED DOCUMENTS')
        # client = get_client()
        # class_name = create_class(key, client)
        # print(f'#CREATED CLASS {class_name}')
        # upload_documents(documents, client, class_name)
        # print("#UPLOADED DOCUMENTS")
        # db_client = get_mongo_client()
        # data_db = db_client["data"]
        # websitesCollection = data_db["SummaryWebsites"]
        # update_query = {"$set": {"status": "Ready", "documents": documents}}
        # # Update the document matching the UUID with the new values
        # websitesCollection.update_one({"_id": key}, update_query)
        # return jsonify({"message": "Embaddings Uploaded"}), HTTPStatus.OK
    except Exception as e:
        print(e)
        raise e
