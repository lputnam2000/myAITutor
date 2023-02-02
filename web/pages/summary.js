import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { Button} from '@chakra-ui/react'
import { pdfjs, Document, Page } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: row;
`
const PDFContainer = styled.div`
  flex: 1;
`
const SummaryContainer = styled.div`
  flex: 1;
  border: black 1px solid;
`

const Input = styled.input`
  border: black 1px solid;

`

const Heading = styled.h1`
    color: red;
`

export default function Summary() {
    const [pdfFile, setPdfFile] = useState();
    const [numPages, setNumPages] = useState(1);
    const [pageNumber, setPageNumber] = useState(1);
    const [startingPageNumber, setStartingPageNumber] = useState(0);
    const [endingPageNumber, setEndingPageNumber] = useState(0)

    const handleStartingPageNumber = (e) => {
        if (e.target.value >= 0 && e.target.value <= numPages) {
            setStartingPageNumber(Math.min(numPages, e.target.value))
        }
    }
    const handleEndingPageNumber = (e) => {
        if (e.target.value > 0 && e.target.value <= numPages) {
            setEndingPageNumber(Math.min(numPages, e.target.value))
        }
    }
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    function changePage(offset) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    useEffect(() => {
        console.log(pdfFile)
    }, [pdfFile]);


    const handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            setPdfFile(e.target.files[0])
            const reader = new FileReader()
            console.log(pdfFile)
            reader.readAsDataURL(e.target.files[0])
            console.log()
            reader.onload = () => {
                fetch('/api/text', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ file: reader.result ,
                    startingPageNumber,
                    endingPageNumber,})
                });
            };
            reader.onerror = error => {
                console.error(error);
            };
        }
    }

    return (
    <Container>
        <PDFContainer>
            <input type="file" accept=".pdf" onChange={handleFileInput} name="" id=""/> <>
            <div>
                Staring Page Number :
                <Input type="number" name="" id="" value={startingPageNumber} onChange={handleStartingPageNumber}/>
            </div>
            <div>
                Ending Page Number: <Input type="number" name="" id="" value={endingPageNumber} onChange={handleEndingPageNumber}/>
            </div>

            <Document
                file={pdfFile}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                <Page pageNumber={pageNumber} />
            </Document>
            <div>
                <p>
                    Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
                </p>
                <button
                    type="button"
                    disabled={pageNumber <= 1}
                    onClick={previousPage}
                >
                    Previous
                </button>
                <button
                    type="button"
                    disabled={pageNumber >= numPages}
                    onClick={nextPage}
                >
                    Next
                </button>
            </div>
        </>
        </PDFContainer>
        <SummaryContainer>
            Sum
        </SummaryContainer>
    </Container>
  )
}
