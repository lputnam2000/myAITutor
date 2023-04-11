import fitz
import ocrmypdf
import io
from nltk import tokenize

def needs_ocr(extracted_text):
    total_tokens = 0
    for _, tuples_list in extracted_text.items():
        for tup in tuples_list:
            total_tokens += tup[1]
    return total_tokens < 100

def needs_ocr_embeddings(extracted_text):
    total_tokens = 0
    for dic in extracted_text:
        sentence = dic['sentence']
        total_tokens += len(sentence.split(' '))
    return total_tokens < 100

def extract_text_ocr(blocks, page_number):
    to_return = []
    page_text = ''
    for block in blocks:
        if block[6] == 0:
            text = block[4]
            text = text.replace('\n', " ")
            page_text += text        
    text_split = tokenize.sent_tokenize(page_text)
    for sentence in text_split:
        to_return.append({'sentence': sentence, 'page_number': page_number})
    return to_return

def ocr_the_page(page):
    """Extract the text from passed-in PDF page."""
    src = page.parent  # the page's document
    doc = fitz.open()  # make temporary 1-pager
    doc.insert_pdf(src, from_page=page.number, to_page=page.number)
    pdfbytes = doc.tobytes()
    inbytes = io.BytesIO(pdfbytes)  # transform to BytesIO object
    outbytes = io.BytesIO()  # let ocrmypdf store its result pdf here
    ocrmypdf.ocr(
        inbytes,  # input 1-pager
        outbytes,  # ouput 1-pager
        language="eng",  # modify as required e.g. ("eng", "ger")
        output_type="pdf",  # only need simple PDF format
        # add more paramneters, e.g. to enforce OCR-ing, etc., e.g.
        # force_ocr=True, redo_ocr=True
    )
    ocr_pdf = fitz.open(filetype="pdf", stream=outbytes.getvalue())  # read output as fitz PDF

    # return ocr_pdf[0] this causes an error. idk why
    blocks = ocr_pdf[0].get_text('blocks')  # ...and extract text from the page
    return blocks
