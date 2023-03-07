from http import HTTPStatus
from flask import Flask, Blueprint, jsonify, request
from ..utils import require_api_key, get_mongo_client
from .websiteToEmbeddings import get_documents, get_client, create_class, upload_documents

embeddings_bp = Blueprint('embeddings', __name__, url_prefix='/embeddings')

@embeddings_bp.route('/websites/', methods=['POST'])
@require_api_key
def main_view():
    try:
        data = request.json # .data is empty
        url = data['url']
        key = data['key']
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
        return jsonify({"message": "Embaddings Uploaded"}), HTTPStatus.OK
    except Exception as e:
        print(e)
        raise e
