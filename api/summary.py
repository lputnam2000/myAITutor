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
WITHOUT_CONTEXT_TEMPLATE = """Please read the following text and create a study guide summarizing and presenting the key points for students. Your study guide should be clear, concise, and organized, and written in easy-to-read language.

Organize the study guide as a JSON array of arrays. Each subarray should contain two elements:

The first element should be the heading or subheading, represented as a string.
The second element should be a clear and succinct summary of the key points for the heading, including relevant technical terms and concepts, and structured for easy understanding and recall. Provide the necessary context required to understand the key points, and use examples and analogies where appropriate.
Use active voice and avoid using complex or jargon-laden language. Make sure that the study guide is well-structured and easy to navigate, with a logical progression of ideas and concepts.

Here is the text to be summarized:
{text}
After reading the text, please provide your study guide in the following JSON array format:
[[ "Heading or subheading 1", "Clear and succinct summary of the key points for this heading"],
  ["Heading or subheading 2", "Clear and succinct summary of the key points for this heading"],
  ...]
Please make sure that your study guide is well-organized and easy to navigate, with a logical progression of ideas and concepts. Keep in mind that this study guide will be used by students, so use language that is easy to understand and examples that are relevant to their level of knowledge.
Study Guide:
["""
PROMPT_WITHOUT_CONTEXT = PromptTemplate(input_variables=["text"], template=WITHOUT_CONTEXT_TEMPLATE)

WITH_CONTEXT_TEMPLATE = """Please read the following text and create a study guide summarizing and presenting the key points for students. Your study guide should be clear, concise, and organized, and written in easy-to-read language.

Organize the study guide as a JSON array of arrays. Each subarray should contain two elements:

The first element should be the heading or subheading, represented as a string.
The second element should be a clear and succinct summary of the key points for the heading, including relevant technical terms and concepts, and structured for easy understanding and recall. Provide the necessary context required to understand the key points, and use examples and analogies where appropriate.
Use active voice and avoid using complex or jargon-laden language. Make sure that the study guide is well-structured and easy to navigate, with a logical progression of ideas and concepts.
Here is some context to better understand the text. Build off this text:
{context}
Here is the text to be summarized:
{text}
After reading the text, please provide your study guide in the following JSON array format:
[[ "Heading or subheading 1", "Clear and succinct summary of the key points for this heading"],
  ["Heading or subheading 2", "Clear and succinct summary of the key points for this heading"],
  ...]
Please make sure that your study guide is well-organized and easy to navigate, with a logical progression of ideas and concepts. Keep in mind that this study guide will be used by students, so use language that is easy to understand and examples that are relevant to their level of knowledge.
Study Guide:
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
        response = openai.ChatCompletion.create(
            model='gpt-3.5-turbo',
            messages=[
                {"role": "system", "content":"You are an AI assistant that is the best at creating study guides because you possess an exceptional ability to synthesize complex information into easily understandable and actionable steps, which makes your study guides incredibly effective and valuable for learners. Your attention to detail and commitment to providing comprehensive and accurate information also make you stand out as the best study guide creator."},
                {"role": "user", "content":prompt}
            ]
        )
        textResp = '[' + response.choices[0]['message']['content']
        return json.loads(textResp)
    else:
        prompt = PROMPT_WITH_CONTEXT.format(text=text, context=context)
        num_tokens = len(ENCODER.encode(prompt))
        response = openai.ChatCompletion.create(
            model='gpt-3.5-turbo',
            messages=[
                {"role": "system", "content":"You are an AI assistant that is the best at creating study guides because you possess an exceptional ability to synthesize complex information into easily understandable and actionable steps, which makes your study guides incredibly effective and valuable for learners. Your attention to detail and commitment to providing comprehensive and accurate information also make you stand out as the best study guide creator."},
                {"role": "user", "content":prompt}
            ]
        )
        textResp = '[' + response.choices[0]['message']['content']
        jsonResp = json.loads(textResp)
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


def get_summary(doc, start_page=6, end_page=8):
    summary = []

    # extract the text and clean it up
    print('STARTED EXTRACTING TEXT')
    extracted_text = {}
    for i in range(start_page-1, end_page):
        page = doc.load_page(i)
        extracted_text[i] = extract_text(page)
    print('FINISHED EXTRACTING TEXT')
    
    # generate summary 
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
        generated_summary = make_gpt_summary(input_text, context)
        summary.append((start, summary_end_page, generated_summary))
        context = generate_context(generated_summary)
        start = cur_page

    print('FINISHED SUMMARISING TEXT')
    return summary

if __name__ == "__main__":
    doc = fitz.open('ex2.pdf')
    s = get_summary(doc, 508, 511)
    with open('summary.json', 'w') as f:
        json.dump(s, f)