import React, {useEffect, useState} from 'react';
import styled, {keyframes} from 'styled-components';
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


const gradientKeyframes = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

const Container = styled.div`
  height: 100vh;
  background: linear-gradient(-45deg, #85d4ef, #8ff6de, #ef9c82, #f59ec0 );
  background-size: 400% 400%;
  animation: ${gradientKeyframes} 300s ease infinite;
  width: 100vw;
`


function PageSummary(props) {
    const router = useRouter()
    const {uploadId} = router.query


    return <Container>

        <Navbar/>
        <PDFViewerContextProvider>
            <PDFViewerWithSummary uploadId={uploadId}/>
        </PDFViewerContextProvider>

    </Container>

}

export async function getServerSideProps(context) {
    return {
        props: {}, // will be passed to the page component as props
    }
}

export default PageSummary;