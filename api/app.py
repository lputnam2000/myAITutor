from flask import Flask, request, jsonify
from http import HTTPStatus
from pypdf import PdfReader
import base64
import io

app = Flask(__name__)

@app.route("/")
def index():
    return "<p>Hello, World!</p>"


def get_text(pdf, starting_page, ending_page):
    reader = PdfReader(pdf)
    number_of_pages = len(reader.pages)
    # extractedText = ""
    text = {}
    for i in range(starting_page-1, ending_page):
        page = reader.pages[i]
        # extractedText += page.extract_text() 
        text[i] = page.extract_text()
    return text

def get_documents(pdf, starting_page, ending_page):
    text = get_text(pdf, starting_page, ending_page)
    with open('ex.txt', 'w') as f:
        import json
        f.write(json.dumps(text))
        print(text)
    exit()
    text_splitter = CharacterTextSplitter.from_tiktoken_encoder(chunk_size=500, chunk_overlap=0, separator='.')
    docs = text_splitter.split_text(text)
    return docs


@app.route("/text", methods=['POST'])
def parsePDF():
    encodedPDF = request.json['file']
    decodedPDF= base64.b64decode(encodedPDF)
    pdfFile = io.BytesIO(decodedPDF)
    
    reader = PdfReader(pdfFile)
    number_of_pages = len(reader.pages)
    
    startingPageNumber = request.json['startingPageNumber']
    endingPageNumber = request.json['endingPageNumber']
    extractedText = []
    for i in range(startingPageNumber-1, endingPageNumber):
        page = reader.pages[i]
        extractedText.append(page.extract_text()) 


    resp = {
        extractedText: extractedText
    }
    return jsonify(resp), HTTPStatus.OK