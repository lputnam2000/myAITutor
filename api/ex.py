import fitz
import tiktoken
from nltk import tokenize
from langchain import PromptTemplate
import os
import openai
import json

OPEN_AI_KEY = "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"
openai.api_key = OPEN_AI_KEY

ENCODER = tiktoken.get_encoding("gpt2")
WITHOUT_CONTEXT_TEMPLATE = """Organize the notes on the text data as a JSON array of arrays. Each subarray should contain two elements:

The first element should be the heading or subheading, represented as a string.
The second element should be a clear notes of the first element's heading, including key points and relevant technical terms, and structured for easy understanding and recall. Provide the necessary context required to understand the notes. Avoid using non-meaningful words.

Data-
{text}
Notes-
["""
PROMPT_WITHOUT_CONTEXT = PromptTemplate(input_variables=["text"], template=WITHOUT_CONTEXT_TEMPLATE)

WITH_CONTEXT_TEMPLATE = """Organize the notes on the text data as a JSON array of arrays. Use the context provided to better understand the text. Each subarray should contain two elements:

The first element should be the heading or subheading, represented as a string.
The second element should be a clear notes of the first element's heading, including key points and relevant technical terms, and structured for easy understanding and recall. Provide the necessary context required to understand the notes. Avoid using non-meaningful words.

Context-
{context}
Data-
{text}
Notes-
["""
PROMPT_WITH_CONTEXT = PromptTemplate(input_variables=["text", "context"], template=WITH_CONTEXT_TEMPLATE)



def format_for_gpt3(text_list):
    encodings = ENCODER.encode_batch(text_list)
    to_return = []
    for i in range(len(encodings)):
        if len(encodings[i]) > 300:
            text_split = tokenize.sent_tokenize(text_list[i])
            text_split_encodings = ENCODER.encode_batch(text_split)
            j = 0
            while j < len(text_split):
                block = ""
                block_length = 0
                while block_length < 300 and j < len(text_split):
                    block += text_split[j] + ' '
                    block_length += len(text_split_encodings[j])
                    j += 1
                to_return.append((block, block_length))
        else:
            to_return.append((text_list[i], len(encodings[i])))

    return to_return
    

def make_gpt_summary(text, context=None):
    if context == None:
        prompt = PROMPT_WITHOUT_CONTEXT.format(text=text)
        num_tokens = len(ENCODER.encode(prompt))
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            temperature=0.3,
            max_tokens=4000-num_tokens,
            top_p=1,
            frequency_penalty=0.5,
            presence_penalty=0,
            stop=["];"],
        )
        textResp = '[' + response.choices[0]['text']
        return json.loads(textResp)
    else:
        prompt = PROMPT_WITH_CONTEXT.format(text=text, context=context)
        num_tokens = len(ENCODER.encode(prompt))
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            temperature=0.3,
            max_tokens=4000-num_tokens,
            top_p=1,
            frequency_penalty=0.5,
            presence_penalty=0,
            stop=["];"],
        )
        textResp = '[' + response.choices[0]['text']
        return json.loads(textResp)


def extract_text(page):
    blocks = page.get_text('blocks')
    final_text = []
    for block in blocks:
        if block[6] == 0:
            text = block[4]
            text = text.replace('\n', " ")
            final_text.append(text)
    return format_for_gpt3(final_text)


def generate_context(summary):
    last_el = summary[len(summary)-1]
    summary_text = last_el[0] + '. ' + last_el[1]
    text_split = tokenize.sent_tokenize(summary_text)
    final_context = ""
    text_split_encodings = ENCODER.encode_batch(text_split)
    context_token_count = 0
    i = len(text_split)-1
    while context_token_count < 150 and i >= 0 :
        final_context = text_split[i] + ' ' + final_context 
        context_token_count += len(text_split_encodings[i])
        i -= 1
    return final_context


def get_summary(pdf='ex2.pdf', start_page=6, end_page=10):
    doc = fitz.open(pdf)
    summary = []

    # extract the text and clean it up
    print('STARTED EXTRACTING TEXT')
    extracted_text = {}
    for i in range(start_page-1, end_page):
        page = doc.load_page(i)
        extracted_text[i] = extract_text(page)
    print(extracted_text)
    exit()
    s = json.dumps(extracted_text)
    print(len(ENCODER.encode(s)))

    print('FINISHED SUMMARISING TEXT')
    return summary

if __name__ == "__main__":
    s = get_summary(start_page=91, end_page=95)
