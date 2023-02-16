import React, { useContext, useEffect, useRef, useState } from 'react';
import { Document, Page } from "react-pdf";
import styled from "styled-components";
import ViewerControls from "./ViewerControls";
import PDFViewerContextProvider, { PDFViewerContext } from "./context";
import Summary from "./Summary";
import PDFViewer from "./PDFViewer";
import readingIndicatorPlugin from "./ReadingIndicatorPlugin"

import summaryJson from '/public/summary.json'

const Container = styled.div`
  background-color: whitesmoke;
  //min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 40px;
`

const StyledPage = styled(Page)`
  margin-bottom: 5px;
`
const InnerContainer = styled.div`
  display: flex;
  flex-direction: row;
  //justify-content: space-between;
`

const PDFViewerContainer = styled.div`
  flex: 1;
`

function PdfViewerWithSummary({ pdfFile }) {
    const [startingPageNumber, setStartingPageNumber] = useState(0);
    const [endingPageNumber, setEndingPageNumber] = useState(0)

    const { numPages, setNumPages, pageNumber, setPageNumber, pagesRef, getPagesMap } = useContext(PDFViewerContext);
    // const pagesRef = useRef([]);

    const scrollCallback = (e) => { console.log("scrolled") }
    const readingIndicatorPluginInstance = readingIndicatorPlugin();
    const { ReadingIndicator } = readingIndicatorPluginInstance;


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


    function changePage(offset) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPageNumber(1);
        // pagesRef.current = pagesRef.current.slice(0, numPages)
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    function changePage(offset) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    const setPageFocus = (e) => {
        if (e.target.value >= 0) {
            console.log(pagesRef)
            pagesRef.current[e.target.value].current.focus();
        }
    }




    return (
        <Container>
            <InnerContainer>
                <PDFViewerContextProvider>
                    <ReadingIndicator />
                    <PDFViewerContainer>
                        <PDFViewer pdfFile={pdfFile} />
                    </PDFViewerContainer>
                    <Summary summaryJson={summaryJson} />
                </PDFViewerContextProvider>
            </InnerContainer>
        </Container>
    );
}


export default PdfViewerWithSummary;