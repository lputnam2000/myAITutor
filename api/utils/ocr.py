import fitz
import ocrmypdf
import io

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
    print(blocks)
    return blocks
