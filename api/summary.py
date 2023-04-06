import fitz
import tiktoken
from nltk import tokenize
from langchain import PromptTemplate
import os
import openai
import json


OPEN_AI_KEY = "''"
openai.api_key = OPEN_AI_KEY
ENCODER = tiktoken.get_encoding("gpt2")
WITHOUT_CONTEXT_TEMPLATE = """
Here is the text to be summarized:
{text}
Study Guide in Markdown:
["""
PROMPT_WITHOUT_CONTEXT = PromptTemplate(input_variables=["text"], template=WITHOUT_CONTEXT_TEMPLATE)

WITH_CONTEXT_TEMPLATE = """
Use the provided context to ensure a smooth transition between sections
Previous Summary Context:
{context}
Here is the text to be summarized:
{text}
Study Guide in Markdown:
"""
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
    

def make_gpt_summary(fileType, text, context=None):
    print('called')
    label = ''
    if fileType == 'mp4' or fileType == 'youtube':
        label = 'Transcripts of a Video'
    elif fileType == 'url':
        label = 'Website data'
    else:
        label = 'Text from a PDF' 

    try:
        if context == None:
            prompt = PROMPT_WITHOUT_CONTEXT.format(text=text)
            num_tokens = len(ENCODER.encode(prompt))
            response = openai.ChatCompletion.create(
                model='gpt-3.5-turbo',
                messages=[
                    {"role": "system", "content":f'You are an AI assistant that is the best at creating the most comprehensive, engaging, and easy-to-understand notes of the given {label}. Your ultimate goal is to make these notes the go-to resource for anyone wishing to learn about the topic, surpassing the need to watch the video itself. Follow these Instructions to create the best notes. Instructions: Use active voice: Write in an active voice to make the summary more engaging and easier to understand. Format using markdown: Organize the summary with appropriate headings, subheadings, tables, math equations, bullet points, and numbered lists. Highlight crucial keywords and special terms: Ensure that all essential keywords and terms from the {label} are included and emphasized. Break down complex concepts: Simplify difficult concepts by breaking them into smaller, more manageable sections. Provide examples or analogies: Include relevant examples or analogies to clarify concepts and make the material more relatable. Maintain a logical flow: Organize the content in a logical order to help readers follow along and understand the progression of ideas. Be concise: Keep the summary brief and to the point, focusing on the most important information from the {label}.'},
                    {"role": "user", "content":prompt}
                ]
            )
            textResp =   response.choices[0]['message']['content']
            return textResp
        else:
            prompt = PROMPT_WITH_CONTEXT.format(text=text, context=context)
            num_tokens = len(ENCODER.encode(prompt))
            response = openai.ChatCompletion.create(
                model='gpt-3.5-turbo',
                messages=[
                    {"role": "system", "content":f'You are an AI assistant that is the best at creating the most comprehensive, engaging, and easy-to-understand notes of the given {label}. Your ultimate goal is to make these notes the go-to resource for anyone wishing to learn about the topic, surpassing the need to watch the video itself. Follow these Instructions to create the best notes. Instructions: Use active voice: Write in an active voice to make the summary more engaging and easier to understand. Format using markdown: Organize the summary with appropriate headings, subheadings, tables, math equations, bullet points, and numbered lists. Highlight crucial keywords and special terms: Ensure that all essential keywords and terms from the {label} are included and emphasized. Break down complex concepts: Simplify difficult concepts by breaking them into smaller, more manageable sections. Provide examples or analogies: Include relevant examples or analogies to clarify concepts and make the material more relatable. Maintain a logical flow: Organize the content in a logical order to help readers follow along and understand the progression of ideas. Be concise: Keep the summary brief and to the point, focusing on the most important information from the {label}.'},
                    {"role": "user", "content":prompt}
                ]
            )
            textResp = response.choices[0]['message']['content']
            return textResp
    except Exception as e:
        print(e)
        return make_gpt_summary(fileType, text,context)


def extract_text(page):
    blocks = page.get_text('blocks')
    final_text = []
    for block in blocks:
        if block[6] == 0:
            text = block[4]
            text = text.replace('\n', " ")
            final_text.append(text)
    return format_for_gpt3(final_text)

def extract_text_ocr(blocks):
    final_text = []
    for block in blocks:
        if block[6] == 0:
            text = block[4]
            text = text.replace('\n', " ")
            final_text.append(text)
    print(final_text)
    return format_for_gpt3(final_text)

def generate_context(summary):
    words = summary.split()
    last_350_words = " ".join(words[-400:])
    return last_350_words
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

def needs_ocr(extracted_text):
    total_tokens = 0
    for _, tuples_list in extracted_text.items():
        for tup in tuples_list:
            total_tokens += tup[1]
    return total_tokens < 100

def get_summary(doc, start_page=6, end_page=8, send_summary_update=lambda x:  None):
    summary = []

    # extract the text and clean it up
    print('STARTED EXTRACTING TEXT')
    extracted_text = {}
    for i in range(start_page-1, end_page):
        page = doc.load_page(i)
        extracted_text[i] = extract_text(page)
    print('FINISHED EXTRACTING TEXT')
    if needs_ocr(extracted_text):
        print('OCRing PDF')
        for i in range(start_page-1, end_page):
            page = doc.load_page(i)
            extracted_text[i] = extract_text_ocr(ocr_the_page(page))
        print('FINISHED OCR EXTRACTION')

    cur_page = start_page-1
    start = cur_page
    cur_block = 0
    context = None
    print('STARTED SUMMARISING TEXT')
    while cur_page < end_page:
        input_text = ""
        input_text_tokens = 0
        page_blocks = extracted_text[cur_page]
        while input_text_tokens < 1900:
            input_text += page_blocks[cur_block][0] + ' '
            input_text_tokens += page_blocks[cur_block][1]
            cur_block += 1
            if cur_block == len(page_blocks):
                cur_block = 0
                cur_page += 1
                if cur_page == end_page:
                    break
                else:
                    page_blocks = extracted_text[cur_page]
        summary_end_page = cur_page-1 if cur_page==end_page else cur_page
        print(f'{start}-{summary_end_page}')
        generated_summary = make_gpt_summary('pdf', input_text, context)
        if generated_summary == None:
            continue
        summary.append((start, summary_end_page, generated_summary))
        send_summary_update(summary)
        context = generate_context(generated_summary)
        start = cur_page

    print('FINISHED SUMMARISING TEXT')
    return summary

def get_summary_string(content_arr:str, send_summary_update, fileType='youtube'):
    summary = []
    # extract the text and clean it up
    print('STARTED FORMATTING TEXT')
    formatted_text = format_for_gpt3(content_arr)
    print('FINISHED EXTRACTING TEXT')
    # generate summary 
    idx = 0
    context = None
    print('STARTED SUMMARISING TEXT')
    while idx < len(formatted_text):
        input_text = ""
        input_text_tokens = 0
        while input_text_tokens < 1900:
            input_text += formatted_text[idx][0] + ' '
            input_text_tokens += formatted_text[idx][1]
            idx += 1
            if idx == len(formatted_text):
                break
        generated_summary = make_gpt_summary(fileType, input_text, context)
        summary.append((-1, -1, generated_summary))
        send_summary_update(summary)
        context = generate_context(generated_summary)

    print('FINISHED SUMMARISING TEXT')
    return summary


if __name__ == "__main__":
    doc = fitz.open('ex2.pdf')
    s = get_summary(doc, 508, 511)
    with open('summary.json', 'w') as f:
        json.dump(s, f)