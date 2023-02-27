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

client = get_client()

schema = client.schema.get()
print(json.dumps(schema, indent=4))