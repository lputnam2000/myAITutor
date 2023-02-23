import React, {useContext, useEffect, useState} from 'react';
import styled from "styled-components";
import {PDFViewerContext} from "./context";
import Summary from "./Summary";
import PDFViewer from "./PDFViewer";


const Container = styled.div`
  background-color: whitesmoke;
  //min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 40px;
`


const InnerContainer = styled.div`
  display: flex;
  flex-direction: row;
  //justify-content: space-between;
`

const PDFViewerContainer = styled.div`
  flex: 1;
`

function PdfViewerWithSummary({pdfFile, uploadId}) {

    const {setPdfKey} = useContext(PDFViewerContext);
    useEffect(() => {
        setPdfKey(uploadId)
    }, [uploadId]);


    // const pagesRef = useRef([]);


    return (
        <Container>
            <InnerContainer>
                <PDFViewerContainer>
                    <PDFViewer pdfFile={pdfFile} uploadId={uploadId}/>
                </PDFViewerContainer>
                <Summary uploadId={uploadId}/>
            </InnerContainer>
        </Container>
    );
}

export default PdfViewerWithSummary;