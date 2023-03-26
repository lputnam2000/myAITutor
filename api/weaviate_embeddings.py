import weaviate
import json
import requests
import tiktoken
import json
from nltk import tokenize
import fitz
import time

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


def create_website_class(key:str, client):
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

def create_pdf_class(key:str, client):
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
        {
            "dataType": ["int"],
            "description": "The start time for the text",
            "name": "start_page",
            "moduleConfig": {
                "text2vec-openai": {
                "skip": True
                }
            },
        },
        {
            "dataType": ["int"],
            "description": "The end time for the text",
            "name": "end_page",
            "moduleConfig": {
                "text2vec-openai": {
                "skip": True
                }
            },
        }
        ]
    }
    client.schema.create_class(class_obj)
    return class_name

def create_youtube_class(key:str, client):
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
        {
            "dataType": ["int"],
            "description": "The start time for the text",
            "name": "start_time",
            "moduleConfig": {
                "text2vec-openai": {
                "skip": True
                }
            },
        },
        {
            "dataType": ["int"],
            "description": "The end time for the text",
            "name": "end_time",
            "moduleConfig": {
                "text2vec-openai": {
                "skip": True
                }
            },
        }
        ]
    }
    client.schema.create_class(class_obj)
    return class_name

def format_for_documents(extracted_text):
    text_list = [t["text"] for t in extracted_text]
    page_number = [t["page_number"] for t in extracted_text]
    encodings = ENCODER.encode_batch(text_list)
    to_return = []

    for i in range(len(encodings)):
        doc_length = len(encodings[i])
        doc_text = text_list[i]
        start_page = page_number[i]
        while doc_length < 500 and i+1 < len(encodings):
            i += 1
            doc_length += len(encodings[i]) 
            doc_text += ' ' + text_list[i]
        end_page = page_number[i]
        to_return.append({'text':doc_text,'start_page':start_page, 'end_page': end_page})
    return to_return



def get_documents(doc):
    print('STARTED EXTRACTING TEXT')
    extracted_text = []
    for i in range(0, len(doc)):
        page = doc.load_page(i)
        page_text = ''
        blocks = page.get_text('blocks')
        for block in blocks:
            if block[6] == 0:
                text = block[4]
                text = text.replace('\n', " ")
                page_text += text        
        text_split = tokenize.sent_tokenize(page_text)
        for sentence in text_split:
            extracted_text.append({'text': sentence, 'page_number': i+1})
        # extracted_text.extend(text_split)
    formatted_documents = format_for_documents(extracted_text)
    print(formatted_documents)
    print('FINISHED EXTRACTING TEXT')
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

def upload_documents_pdf(documents, client, class_name):
    configure_batch(client, 1000, 30)
    with client.batch as batch:
        # Batch import all Questions
        for i in range(len(documents)):
            properties = documents[i]
            print(i)
            client.batch.add_data_object(properties, class_name)

def upload_documents_website(documents, client, class_name):
    configure_batch(client, 1000, 30)
    with client.batch as batch:
        # Batch import all Questions
        for i in range(len(documents)):
            properties = {
                
                "text": documents[i]
            }
            print(i)
            client.batch.add_data_object(properties, class_name)

def upload_documents_youtube(documents, client, class_name):
    configure_batch(client, 1000, 30)
    with client.batch as batch:
        # Batch import all Questions
        for i in range(len(documents)):
            print(documents[i])
            properties = documents[i]
            print(i)
            client.batch.add_data_object(properties, class_name)

# documents = get_documents(fitz.open('ex2.pdf'))
# client = get_client()
# class_name = create_class('new_class', client)
# upload_documents(documents, client, class_name)
