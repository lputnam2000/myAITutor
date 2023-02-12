import openai
import pinecone

#initialize openai
openai.organization = 'org-kbmIwXuUVgonTktQMnQiwfrt'
openai.api_key = "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"
MODEL = 'text-embedding-ada-002'

res = openai.Embedding.create(
    input=[
        "Sample document text goes here",
        "there will be several phrases in each batch"
    ], engine=MODEL
)
embeds = [record['embedding'] for record in res['data']]

#initialize pinecone
pinecone.init(
    api_key="cf4533bd-b762-4b24-8d04-585d4050ea90",
    environment="us-east1-gcp"
)

# check if 'openai' index already exists (only create index if not)
if 'openai' not in pinecone.list_indexes():
    pinecone.create_index('openai', dimension=len(embeds[0]))
# connect to index
index = pinecone.Index('openai')

print(res)
import pdb
pdb.set_trace()