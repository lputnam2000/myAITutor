import React from 'react';
import styled from 'styled-components';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import ViewerContextProvider from "../components/viewer/context";
import ViewerWithSummary from "../components/viewer/ViewerWithSummary";
import Layout from "../Layouts/basicLayout"

const Container = styled.div`
  height: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`


function PageSummary() {
    return (
        <ViewerContextProvider>
            <Container>
                <ViewerWithSummary/>
            </Container>
        </ViewerContextProvider>
    )
}

PageSummary.PageLayout = Layout;

export default PageSummary;