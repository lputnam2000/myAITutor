from pypdf import PdfReader
from langchain.llms import OpenAI
from langchain import PromptTemplate
import os
import openai
from langchain.text_splitter import CharacterTextSplitter
from langchain.docstore.document import Document
from langchain.chains.summarize import load_summarize_chain
import json
import openai
import tiktoken

import re
openai.api_key = os.getenv("OPENAI_API_KEY")
# response = openai.Completion.create(
#   model="text-davinci-003",
#   prompt="Organize the notes on the data as a JSON array of arrays. Each subarray should contain two elements:\n\nThe first element should be the heading or subheading, represented as a string.\nThe second element should be a clear summary of the first element's heading, including key points and relevant technical terms, and structured for easy understanding and recall. Provide the necessary context required to understand this summary. Avoid using non-meaningful words.\n\n",
#   temperature=0,
#   max_tokens=1623,
#   top_p=1,
#   frequency_penalty=0,
#   presence_penalty=0,
#   stop=["];"]
# )


MODEL_NAME='text-davinci-003'


def extract_text(starting_page=87, ending_page=95):
    reader = PdfReader("ex3.pdf")
    number_of_pages = len(reader.pages)
    extractedText = ""
    for i in range(starting_page-1, ending_page):
        page = reader.pages[i]
        extractedText += page.extract_text() 
    return extractedText



text_splitter = CharacterTextSplitter.from_tiktoken_encoder(chunk_size=2500, chunk_overlap=0, separator='.')
docs = text_splitter.split_text(extract_text(1, 11))

final_summary = []


template = """Organize the notes on the text data as a JSON array of arrays. Each subarray should contain two elements:

The first element should be the heading or subheading, represented as a string.
The second element should be a clear summary of the first element's heading, including key points and relevant technical terms, and structured for easy understanding and recall. Provide the necessary context required to understand this summary. Avoid using non-meaningful words.

Data-
{text}
Notes-
["""
PROMPT = PromptTemplate(input_variables=["text"], template=template)

KEY = "''"

import os
import openai

openai.api_key = KEY
encoding = tiktoken.get_encoding("gpt2")
import pdb
pdb.set_trace()
summary = []
for doc in docs:
    prompt = PROMPT.format(text=doc)
    en = encoding.encode(prompt)

    response = openai.Completion.create(
    model="text-davinci-003",
    prompt=prompt,
    temperature=0,
    max_tokens=4000-len(en),
    top_p=1,
    frequency_penalty=0,
    presence_penalty=0,
    stop=["];"],
    )
    textResp = '[' + response.choices[0]['text']
    print(textResp)
    summary.extend(json.loads(textResp))

fp = open('sum1.json', "w")
json.dump({'summary': summary}, fp)


# print(text[0])

# def cleanup_text(text:str):
#     textSplitUp = []
#     for t in text.split('\n\n'):
#         textSplitUp.extend(t.replace('\n', '').split('.'))

#     for t in textSplitUp:
#         for t1 in t:
#             t1 += '.'

#     return textSplitUp

# textSplitUp = cleanup_text(extract_text())

# import pdb
# pdb.set_trace()


# for i in len(textSplitUp):
#     request_data = ""
#     token_limit = 1800 

    # while token_limit +> 0:

# format = prompt.format(data=extract_text())

# llm = OpenAI(model_name=MODEL_NAME)


# print(extractedText)
# print("".join([f"Page {i}:\n {extractedText[i]}\n" for i in range(len(extractedText))]))