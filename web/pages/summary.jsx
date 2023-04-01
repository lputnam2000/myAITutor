import React, {useEffect, useState} from 'react';
import styled, {keyframes} from 'styled-components';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import ViewerContextProvider from "../components/viewer/context";
import ViewerWithSummary from "../components/viewer/ViewerWithSummary";
import Navbar from "../components/UIComponents/Navbar";
import Layout from "../Layouts/basicLayout"
import WebsocketContextProvider from "../components/WebsocketContext";


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
  //background: linear-gradient(-45deg, #85d4ef, #8ff6de, #ef9c82, #f59ec0);
`


function PageSummary(props) {
    return <Container>
        <ViewerContextProvider>
            <ViewerWithSummary/>
        </ViewerContextProvider>
    </Container>

}

PageSummary.PageLayout = Layout;

export default PageSummary;