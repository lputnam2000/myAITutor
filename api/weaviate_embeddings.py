import weaviate
import json
import requests
import tiktoken
import json
from nltk import tokenize, word_tokenize
import fitz
import time
from sentence_transformers import SentenceTransformer
from nltk.corpus import stopwords
import numpy as np

ENCODER = tiktoken.get_encoding("gpt2")
OPEN_AI_KEY = "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"
MODEL = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

def send_batch_update_progress(send_progress_update, value, size):
    def inner_function():
        nonlocal progress_value
        progress_value += size
        send_progress_update(progress_value, "Making Notes! 📝🦍")
    progress_value = value
    return inner_function

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
        "vectorizer": "none",
        "properties": [
        {
            "dataType": ["text"],
            "description": "The text for the document",
            "name": "text",
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
        "vectorizer": "none",
        "properties": [
            {
                "name": "text",
                "dataType": ["string"],
                "description": "The text content of the document."
            },
            {
                "name": "start_page",
                "dataType": ["int"],
                "description": "The page number where the text starts."
            },
            {
                "name": "end_page",
                "dataType": ["int"],
                "description": "The page number where the text ends."
            }
        ],
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
            "dataType": ["number"],
            "description": "The start time for the text",
            "name": "start_time",
            "moduleConfig": {
                "text2vec-openai": {
                "skip": True
                }
            },
        },
        {
            "dataType": ["number"],
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

def string_to_embedding(str):
    return MODEL.encode(str).tolist()

def sentences_to_embeddings(clean_sentences, batch_size=64):
    # return model.encode(clean_sentences)
    num_batches = int(np.ceil(len(clean_sentences) / batch_size))

    # Initialize an empty array to store the embeddings
    embeddings = np.empty((len(clean_sentences), MODEL.get_sentence_embedding_dimension()))

    # Loop over the batches and encode the sentences in each batch
    for i in range(num_batches):
        start_index = i * batch_size
        end_index = min((i+1) * batch_size, len(clean_sentences))
        batch_sentences = clean_sentences[start_index:end_index]
        batch_embeddings = MODEL.encode(batch_sentences)
        embeddings[start_index:end_index] = batch_embeddings

    return embeddings

def clean_text(sentences):
    stop_words = stopwords.words('english')
    tokenized_sentences = []
    for sentence in sentences:
        tokens = [token.lower() for token in word_tokenize(sentence)]
        tokens = [token for token in tokens if token not in stop_words and token.isalpha()]
        tokenized_sentences.append(" ".join(tokens) + ".")
    return tokenized_sentences

def format_for_documents(extracted_text):
    original_sentences = [t["sentence"] for t in extracted_text]
    encodings = ENCODER.encode_batch(original_sentences)
    page_number = [t["page_number"] for t in extracted_text]
    to_return = []

    i = 0
    while i < len(encodings):
        doc_length = len(encodings[i])
        doc_text = original_sentences[i]
        start_page = page_number[i]
        while doc_length < 250 and i+1 < len(encodings):
            i += 1
            doc_length += len(encodings[i]) 
            doc_text += ' ' + original_sentences[i]
        end_page = page_number[i]
        to_return.append({'text':doc_text,'start_page':start_page, 'end_page': end_page})
        i += 1
    return to_return

def extract_text(doc):
    print('STARTED EXTRACTING TEXT')
    extracted_text = []

    for i in range(0 , len(doc)):
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
            extracted_text.append({'sentence': sentence, 'page_number': i+1})
    print('FINISHED EXTRACTING TEXT')
    return extracted_text

def add_embeddings_to_formatted_text(document, embedding):
    document['embedding'] = embedding
    return document

def get_documents(doc):
    extracted_text = extract_text(doc)
    format_text_for_documents = format_for_documents(extracted_text)
    clean_text_to_embed = clean_text([dic['text'] for dic in format_text_for_documents])
    embeddings = sentences_to_embeddings(clean_text_to_embed)
    final_data = [add_embeddings_to_formatted_text(document, embedding) for (document, embedding) in zip(format_text_for_documents, embeddings)]
    return final_data

def configure_batch(client, batch_size: int, batch_target_rate: int, send_progress_update):
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
        send_progress_update()
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

def calculate_increment_value(num_documents):
    num_batches =num_documents/1000 if num_documents%1000 == 0 else (num_documents//1) + 1
    progress_per_batch = 57 / num_batches
    return int(progress_per_batch)

def upload_documents_pdf(formatted_docs_with_embeddings, client, class_name, send_progress_update):
    configure_batch(client, 1000, 30, send_batch_update_progress(send_progress_update, 40, calculate_increment_value(len(formatted_docs_with_embeddings))))
    with client.batch as batch:
        # Batch import all Questions
        for i in range(len(formatted_docs_with_embeddings)):
            properties = {'text':formatted_docs_with_embeddings[i]['text'],'start_page':formatted_docs_with_embeddings[i]['start_page'], 'end_page': formatted_docs_with_embeddings[i]['end_page']}
            embedding = formatted_docs_with_embeddings[i]['embedding']
            print(i)
            client.batch.add_data_object(properties, class_name, vector=embedding)

def upload_documents_website(documents, embeddings, client, class_name, send_progress_update):
    configure_batch(client, 1000, 30, send_batch_update_progress(send_progress_update, 40, calculate_increment_value(len(documents))))
    with client.batch as batch:
        # Batch import all Questions
        for i in range(len(documents)):
            properties = {
                "text": documents[i]
            }
            print(i)
            client.batch.add_data_object(properties, class_name, vector=embeddings[i])

def upload_documents_youtube(documents, client, class_name, send_progress_update):
    configure_batch(client, 1000, 30, send_batch_update_progress(send_progress_update, 40, calculate_increment_value(len(documents))))
    with client.batch as batch:
        # Batch import all Questions
        for i in range(len(documents)):
            # print(documents[i])
            properties = documents[i]
            # print(i)
            client.batch.add_data_object(properties, class_name)

# documents = get_documents(fitz.open('ex2.pdf'))
# client = get_client()
# class_name = create_class('new_class', client)
# upload_documents(documents, client, class_name)
