import requests
from readability import Document
import html2text
import re
import tiktoken
import weaviate
import time
from flask import app, current_app
from watchtower import CloudWatchLogHandler
import logging
from ..utils.utils import  get_mongo_client, send_notification_to_client
from ..weaviate_embeddings import upload_documents_website, create_website_class
from ..socket_helper import send_update

FORMATTER = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
ENCODER = tiktoken.get_encoding("gpt2")
OPEN_AI_KEY = "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"

def get_client():
    resource_owner_config = weaviate.AuthClientPassword(
        username = "aryamanparekh12@gmail.com", 
        password = "pBCjEiL6GGN5fjQ", 
        scope = "offline_access"
    )
    return weaviate.Client(
      url = "https://chimpbase.weaviate.network/",
      auth_client_secret=resource_owner_config,
      additional_headers = {
        "X-OpenAI-Api-Key": OPEN_AI_KEY
      }
    )

def create_class(key:str, client):
    key_fmtd = key.replace('-', '_')
    class_name = f'Document_{key_fmtd}'

    class_obj = {
        "class": class_name,
        "description": f'Document Embeddings class for {key}',
        "vectorizer": "text2vec-openai",
        "moduleConfig": {
            "text2vec-openai": {
            "model": "ada",
            "modelVersion": "002",
            "type": "text"
            }
        },
        "properties": [
        {
            "dataType": ["text"],
            "description": "The text for the document",
            "name": "text",
            "moduleConfig": {
                "text2vec-openai": {
                "skip": False,
                "vectorizePropertyName": False
                }
            },
        },
        ]
    }
    client.schema.create_class(class_obj)
    return class_name

def get_text_from_url(url):
    textExtractor = WebsiteTextExtracter()
    extracted_text = textExtractor.extract_formatted_text_from_url(url)
    return extracted_text

def get_text_from_html(html):
    textExtractor = WebsiteTextExtracter()
    extracted_text = textExtractor.extract_formatted_text_from_html(html)
    return extracted_text


def get_documents_from_url(url:str):
    textExtractor = WebsiteTextExtracter()
    extracted_text = textExtractor.extract_formatted_text_from_url(url)
    formatted_documents = extracted_text.split("\n\n")
    return formatted_documents

def get_documents_from_html(html):
    textExtractor = WebsiteTextExtracter()
    extracted_text = textExtractor.extract_formatted_text_from_html(html)
    formatted_documents = extracted_text.split("\n\n")
    return formatted_documents

def configure_batch(client, batch_size: int, batch_target_rate: int):
    """
    Configure the weaviate client's batch so it creates objects at `batch_target_rate`.

    Parameters
    ----------
    client : Client
        The Weaviate client instance.
    batch_size : int
        The batch size.
    batch_target_rate : int
        The batch target rate as # of objects per second.
    """

    def callback(batch_results: dict) -> None:

        # you could print batch errors here
        time_took_to_create_batch = batch_size * (client.batch.creation_time/client.batch.recommended_num_objects)
        time.sleep(
            max(batch_size/batch_target_rate - time_took_to_create_batch + 1, 0)
        )
    client.batch.batch_size = batch_size
    client.batch.configure(
        batch_size=batch_size,
        timeout_retries=5,
        callback=callback,
    )

def upload_documents(documents, client, class_name):
    configure_batch(client, 1000, 30)
    with client.batch as batch:
        # Batch import all Questions
        for i in range(len(documents)):
            properties = {
                "text": documents[i]
            }
            print(i)
            client.batch.add_data_object(properties, class_name)

class WebsiteTextExtracter:
    def __init__(self, summary_content_cutoff=100):
        self.htmlParser = html2text.HTML2Text()
        self.htmlParser.ignore_images = True
        self.htmlParser.ignore_links = True

        # Crude heuristic to determine if html2text failed summary parsing
        # See first link for an example
        self.summary_content_cutoff = summary_content_cutoff

    def get_site_content(self, url):
        try: 
            response = requests.get(url)
            doc = Document(response.content)
            return doc
        except requests.exceptions.RequestException as e:
            print(e)

    def remove_escape_sequences(self, text):
        # return re.sub(r'(\\n)(\\t)*', ' ', text)
        return re.sub(r'\\[n|t]\s*', '\n\n', text)
    
    def remove_excess_whitespace(self, text):
        return re.sub(r'\n\s*\n', '\n\n', text)

    def remove_garbage_text(self, text):
        # text = text.replace('\\n', '')
        # text = text.replace('\\t', '')
        # cleaned_text = re.sub(r'\n\s*\n', '\n\n', text)

        return self.remove_excess_whitespace(self.remove_escape_sequences(text))
    
    def num_tokens(self, text):
        return len(text.split(' '))
    
    def text_from_document(self, document):
        # First try to get doc.summary because of better formatting
        # Otherwise get content. 
        #TODO: figure out why this is fucked
        text = self.htmlParser.handle(document.summary())
        if self.num_tokens(text) < self.summary_content_cutoff:
            text = self.htmlParser.handle(document.content())
        cleaned_text = self.remove_garbage_text(text)

        return cleaned_text


    def extract_formatted_text_from_html(self, html):
        document = Document(html)
        return self.text_from_document(document)


    def extract_formatted_text_from_url(self, url):
        document = self.get_site_content(url)
        return self.text_from_document(document)

    

# if __name__ == "__main__":
#     try:
#         url = "https://en.wikipedia.org/wiki/S"
#         key = 'url-key-3'
#         documents = get_documents(url)
#         print('#PARSED DOCUMENTS')
#         client = get_client()
#         client.schema.delete_class('Document_url_key_3')
#         class_name = create_class(key, client)
#         print(f'#CREATED CLASS {class_name}')
#         upload_documents(documents, client, class_name)
#         print("#UPLOADED DOCUMENTS")
#     except Exception as e:
#         print(e)
#         raise e

def process_chrome_extension_text(data, socketio_instance, stream_name):
    new_handler = CloudWatchLogHandler(log_group_name='your-log-group-ashank', log_stream_name=stream_name)
    new_handler.setFormatter(FORMATTER)
    current_app.logger.addHandler(new_handler)
    try:
        print("ADDING WEBSITE TEXT TO MONGO")
        current_app.logger.info('ADDING WEBSITE TEXT TO MONGO')
        html = data['content']
        website_text = get_text_from_html(html)
        user_id = data['user_id']
        key = data['key']
        db_client = get_mongo_client()
        data_db = db_client["data"]
        websites_collection = data_db["SummaryWebsites"]
        websites_collection.update_one({"_id": key}, {"$set": {"content": website_text, "isWebsiteReady": True}})
        send_update(socketio_instance, user_id, key,  {'key': 'isWebsiteReady', 'value': True})

        print("WEBSITE ADDED TEXT TO MONGO")
        current_app.logger.info('WEBSITE ADDED TEXT TO MONGO')
        current_app.logger.removeHandler(new_handler)
    except Exception as e:
        current_app.logger.info(f'Error:{e}')
        current_app.logger.removeHandler(new_handler)
        print(e)   

def process_web_text(data, socketio_instance, stream_name):
    new_handler = CloudWatchLogHandler(log_group_name='your-log-group-ashank', log_stream_name=stream_name)
    new_handler.setFormatter(FORMATTER)
    current_app.logger.addHandler(new_handler)
    try:
        print("ADDING WEBSITE TEXT TO MONGO")
        current_app.logger.info('ADDING WEBSITE TEXT TO MONGO')
        url = data['url']
        website_text = get_text_from_url(url)
        user_id = data['user_id']
        key = data['key']
        db_client = get_mongo_client()
        data_db = db_client["data"]
        websites_collection = data_db["SummaryWebsites"]
        websites_collection.update_one({"_id": key}, {"$set": {"content": website_text, "isWebsiteReady": True}})
        send_update(socketio_instance, user_id, key,  {'key': 'isWebsiteReady', 'value': True})

        print("WEBSITE ADDED TEXT TO MONGO")
        current_app.logger.info('WEBSITE ADDED TEXT TO MONGO')
        current_app.logger.removeHandler(new_handler)
    except Exception as e:
        current_app.logger.info(f'Error:{e}')
        current_app.logger.removeHandler(new_handler)
        print(e)   

def process_web_embeddings(data, socketio_instance, stream_name):
    new_handler = CloudWatchLogHandler(log_group_name='your-log-group-ashank', log_stream_name=stream_name)
    new_handler.setFormatter(FORMATTER)
    current_app.logger.addHandler(new_handler)
    try:
        url = data['url']
        key = data['key']
        print(f'1. PROCESSING REQ IN THREAD: {key}')
        current_app.logger.info(f'1. PROCESSING REQ IN THREAD: {key}')
        user_id = data['user_id']
        documents = get_documents_from_url(url)
        print('2. PARSED DOCUMENTS')
        current_app.logger.info('2. PARSED DOCUMENTS')
        client = get_client()
        class_name = create_website_class(key, client)
        print(f'3. CREATED CLASS {class_name}')
        current_app.logger.info(f'3. CREATED CLASS {class_name}')
        upload_documents_website(documents, client, class_name)
        print("4. UPLOADED DOCUMENTS")
        current_app.logger.info("4. UPLOADED DOCUMENTS")
        db_client = get_mongo_client()
        data_db = db_client["data"]
        websitesCollection = data_db["SummaryWebsites"]
        update_query = {"$set": {"status": "Ready", "documents": documents}}
        # Update the document matching the UUID with the new values
        websitesCollection.update_one({"_id": key}, update_query)
        send_update(socketio_instance, user_id, key, {'key': 'isReady', 'value': True})
        current_app.logger.removeHandler(new_handler)
        send_notification_to_client(user_id, key, f'Embeddings complete for:{key}')
    except Exception as e:
        current_app.logger.info(f'Error:{e}')
        current_app.logger.removeHandler(new_handler)
        print(e)

def process_chrome_extension_embeddings(data, socketio_instance, stream_name):
    new_handler = CloudWatchLogHandler(log_group_name='your-log-group-ashank', log_stream_name=stream_name)
    new_handler.setFormatter(FORMATTER)
    current_app.logger.addHandler(new_handler)
    try:
        html = data['content']
        user_id = data['user_id']
        key = data['key']
        print(f'1. PROCESSING REQ IN THREAD: {key}')
        current_app.logger.info(f'1. PROCESSING REQ IN THREAD: {key}')
        documents = get_documents_from_html(html)
        print('2. PARSED DOCUMENTS')
        current_app.logger.info('2. PARSED DOCUMENTS')
        client = get_client()
        class_name = create_website_class(key, client)
        print(f'3. CREATED CLASS {class_name}')
        current_app.logger.info(f'3. CREATED CLASS {class_name}')
        upload_documents_website(documents, client, class_name)
        print("4. UPLOADED DOCUMENTS")
        current_app.logger.info("4. UPLOADED DOCUMENTS")
        db_client = get_mongo_client()
        data_db = db_client["data"]
        websitesCollection = data_db["SummaryWebsites"]
        update_query = {"$set": {"status": "Ready", "documents": documents}}
        # Update the document matching the UUID with the new values
        websitesCollection.update_one({"_id": key}, update_query)
        send_update(socketio_instance, user_id, key, {'key': 'isReady', 'value': True})
        current_app.logger.removeHandler(new_handler)
        send_notification_to_client(user_id, key, f'Embeddings complete for:{key}')
    except Exception as e:
        print(e)
        current_app.logger.info(f'Error:{e}')
        current_app.logger.removeHandler(new_handler)
        raise e