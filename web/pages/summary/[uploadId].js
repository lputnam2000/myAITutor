import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {pdfjs} from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import PDFViewerContextProvider from "../../components/PDFViewerComponents/context";
import PDFViewerWithSummary from "../../components/PDFViewerComponents/PDFViewerWithSummary";
import {Viewer, Worker} from '@react-pdf-viewer/core';
import {defaultLayoutPlugin} from '@react-pdf-viewer/default-layout';
import HomeNavbar from "../../components/HomeNavbar";
import {useRouter} from "next/router";
import axios from "axios";
import Navbar from "../../components/UIComponents/Navbar";

const Container = styled.div`
  height: 100vh;
  width: 100vw;
`


function PageSummary(props) {
    const router = useRouter()
    const {uploadId} = router.query
    const [pdfFile, setPdfFile] = useState('')
    useEffect(() => {
        let params = {'key': uploadId}
        axios.get('/api/user/get_pdf', {params: params}).then(res => {
            setPdfFile(res.data.s3Url)
        }).catch(err => {
            console.log(err)
        })
    }, [uploadId])


    return <Container>

        <Navbar/>
        {pdfFile && <PDFViewerContextProvider>
            <PDFViewerWithSummary pdfFile={pdfFile} uploadId={uploadId}/>
        </PDFViewerContextProvider>}

    </Container>

}

export async function getServerSideProps(context) {
    return {
        props: {}, // will be passed to the page component as props
    }
}

export default PageSummary;