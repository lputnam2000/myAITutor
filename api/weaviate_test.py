import weaviate
import json
import requests
import tiktoken
import json
from nltk import tokenize
import fitz
import time

ENCODER = tiktoken.get_encoding("gpt2")
OPEN_AI_KEY = "''"

def get_client() -> weaviate.Client:
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
class_name='Document_1c6be7f2_9aff_49c6_b52d_1f0299c9b18b'
client = get_client()
query = {
    "fields": "text"
}
result  = client.query.aggregate(class_name).with_meta_count().do()


print(result)