import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {pdfjs} from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import PDFViewerContextProvider from "@/components/PDFViewerComponents/context";
import PDFViewerWithSummary from "@/components/PDFViewerComponents/PDFViewerWithSummary";


const Container = styled.div`
  height: 100vh;
  width: 100vw;
`

export default function Summary() {

    useEffect(() => {
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

    }, [])

    const [pdfFile, setPdfFile] = useState('');


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
                // fetch('/api/text', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json'
                //     },
                //     body: JSON.stringify({ file: reader.result ,
                //     startingPageNumber,
                //     endingPageNumber,})
                // });
            };
            reader.onerror = error => {
                console.error(error);
            };
        }
    }


    return (
        <Container>
            {
                pdfFile ?
                    <PDFViewerContextProvider>
                        <PDFViewerWithSummary pdfFile={pdfFile}/>
                    </PDFViewerContextProvider>
                    :
                    <input type="file" accept=".pdf" onChange={handleFileInput} name="" id=""/>

            }

        </Container>
    )
}
