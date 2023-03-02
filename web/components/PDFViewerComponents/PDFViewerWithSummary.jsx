import React, {useContext, useEffect, useState} from 'react';
import styled from "styled-components";
import {PDFViewerContext} from "./context";
import Summary from "./Summary";
import PDFViewer from "./PDFViewer";
import axios from "axios";


const Container = styled.div`
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

function PdfViewerWithSummary() {

    const {setPdfKey, pdfKey, setSummary} = useContext(PDFViewerContext);
    const [pdfFile, setPdfFile] = useState('')

    const getDocumentDetails = (pdfKey) => {
        let params = {'key': pdfKey}
        axios.get('/api/user/get_pdf', {params: params}).then(res => {
            setSummary(res.data.documentDetails.summary)
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        if (!pdfKey) return
        
        let params = {'key': pdfKey}
        axios.get('/api/user/get_pdf', {params: params}).then(res => {
            setPdfFile(res.data.s3Url)
            setSummary(res.data.documentDetails.summary)
        }).catch(err => {
            console.log(err)
        })
        let timer = setInterval(() => getDocumentDetails(pdfKey), 1000);
        return () => {
            timer = null
        }
    }, [pdfKey])


    // const pagesRef = useRef([]);


    return (
        <Container>
            <InnerContainer>
                <PDFViewerContainer>
                    {pdfFile && <PDFViewer pdfFile={pdfFile}/>}
                </PDFViewerContainer>
                <Summary/>
            </InnerContainer>
        </Container>
    );
}

export default PdfViewerWithSummary;