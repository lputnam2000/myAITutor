import React, {useContext, useEffect, useState} from 'react';
import styled from "styled-components";
import {ViewerContext} from "./context";
import Summary from "./Summary";
import PDFViewer from "./PDFViewer";
import axios from "axios";
import WebsiteViewer from "./WebsiteViewer";


const Container = styled.div`
  //min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 10px;
`


const InnerContainer = styled.div`
  display: flex;
  @media (min-width: 750px) {
    flex-direction: row;
  }
  flex-direction: column;
  align-items: center;
  //justify-content: space-between;
`


const Title = styled.h1`
  font-size: 40px;
  margin-left: 30px;
  font-family: var(--font-b);
  margin-bottom: 10px;
`
const ViewerContainer = styled.div`
  flex: 1;
  height: 100%;
  width: 100%;
`
const SummaryContainer = styled.div`
  width: 95%;
  height: 750px;
  @media (min-width: 750px) {
    width: 40vw;
    margin-top: 10px;
    margin-right: 20px;
  }
`

function ViewerWithSummary() {

    const {title, fileType} = useContext(ViewerContext);


    // const pagesRef = useRef([]);


    return (
        <Container>
            <Title>{title}</Title>
            <InnerContainer>
                <ViewerContainer>
                    {
                        fileType === 'pdf' && <PDFViewer/>
                    }
                    {
                        fileType === 'url' && <WebsiteViewer/>
                    }
                </ViewerContainer>
                <SummaryContainer>
                    <Summary/>
                </SummaryContainer>
            </InnerContainer>
        </Container>
    );
}

export default ViewerWithSummary;