import React, {useEffect, useState} from 'react';
import styled, {keyframes} from 'styled-components';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import PDFViewerContextProvider from "../components/PDFViewerComponents/context";
import PDFViewerWithSummary from "../components/PDFViewerComponents/PDFViewerWithSummary";
import Navbar from "../components/UIComponents/Navbar";
import Layout from "../Layouts/basicLayout"


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
  height: auto;
  min-height: 100vh;
  background: linear-gradient(-45deg, #85d4ef, #8ff6de, #ef9c82, #f59ec0);
  background-size: 400% 400%;
  animation: ${gradientKeyframes} 300s ease infinite;
  width: 100vw;
`


function PageSummary(props) {
    return <Container>

        <PDFViewerContextProvider>
            <PDFViewerWithSummary/>
        </PDFViewerContextProvider>

    </Container>

}

PageSummary.PageLayout = Layout;

export default PageSummary;