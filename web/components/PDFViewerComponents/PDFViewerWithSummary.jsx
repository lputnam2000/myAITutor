import React, {useContext, useEffect, useRef, useState} from 'react';
import {Document, Page} from "react-pdf";
import styled from "styled-components";
import ViewerControls from "./ViewerControls";
import {PDFViewerContext} from "./context";
import Summary from "./Summary";
import PDFViewer from "./PDFViewer";

const Container = styled.div`
  background-color: whitesmoke;
  min-height: 100vh;
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

function PdfViewerWithSummary({pdfFile}) {
    const [startingPageNumber, setStartingPageNumber] = useState(0);
    const [endingPageNumber, setEndingPageNumber] = useState(0)

    const {numPages, setNumPages, pageNumber, setPageNumber, pagesRef, getPagesMap} = useContext(PDFViewerContext);
    // const pagesRef = useRef([]);

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

    function onDocumentLoadSuccess({numPages}) {
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
            {/*<div>*/}
            {/*    <p>*/}
            {/*        /!*<div>*!/*/}
            {/*        /!*    Staring Page Number to Summarize :*!/*/}
            {/*        /!*    <Input type="number" name="" id="" value={startingPageNumber}*!/*/}
            {/*        /!*           onChange={handleStartingPageNumber}/>*!/*/}
            {/*        /!*</div>*!/*/}
            {/*        /!*<div>*!/*/}
            {/*        /!*    Ending Page Number to Summarize: <Input type="number" name="" id="" value={endingPageNumber}*!/*/}
            {/*        /!*                                            onChange={handleEndingPageNumber}/>*!/*/}
            {/*        /!*</div>*!/*/}
            {/*        Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}*/}
            {/*    </p>*/}
            {/*    <button*/}
            {/*        type="button"*/}
            {/*        disabled={pageNumber <= 1}*/}
            {/*        onClick={previousPage}*/}
            {/*    >*/}
            {/*        Previous*/}
            {/*    </button>*/}
            {/*    <button*/}
            {/*        type="button"*/}
            {/*        disabled={pageNumber >= numPages}*/}
            {/*        onClick={nextPage}*/}
            {/*    >*/}
            {/*        Next*/}
            {/*    </button>*/}
            {/*</div>*/}
            <InnerContainer>
                <PDFViewerContainer>
                    <PDFViewer pdfFile={pdfFile}/>
                </PDFViewerContainer>
                <Summary/>
            </InnerContainer>
        </Container>
    );
}

export default PdfViewerWithSummary;