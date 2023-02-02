from flask import Flask, request, jsonify
from http import HTTPStatus
from pypdf import PdfReader
import base64
import io

app = Flask(__name__)

@app.route("/")
def index():
    return "<p>Hello, World!</p>"

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
        page = reader.pages[]
        extractedText.append(page.extract_text()) 
    
    
    resp = {
        extractedText: extractedText
    }
    return jsonify(resp), HTTPStatus.OK