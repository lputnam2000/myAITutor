import React, {useContext, useEffect, useState} from 'react';
import styled from "styled-components";
import {ViewerContext} from "./context";
import Summary from "./Summary";
import PDFViewer from "./PDFViewer";
import {BsLink45Deg} from 'react-icons/bs'
import WebsiteViewer from "./WebsiteViewer";
import YoutubeViewer from "./YoutubeViewer";


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


const TitleContainer = styled.h1`
  margin-left: 30px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  color: #48fdce;
  justify-content: space-between;
`

const Title = styled.span`
  font-size: 40px;
  text-decoration: underline;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

const ShareButton = styled.button`
  font-size: 18px;
  font-weight: 600;
  margin-left: 20px;
  margin-right: 20px;
  padding: 5px;
  border-radius: 3px;
  background-color: #FFDB58;
  color: #1c2025;
  transition: box-shadow ease-in-out .1s;

  &:hover {
    box-shadow: 4px 4px 0px #776c43;
  }

  &:active {
    box-shadow: none;
  }

  display: flex;
  align-items: center;
  gap: 5px;
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

function ViewerWithSummary({href}) {

    const {title, fileType} = useContext(ViewerContext);


    const copyUrl = () => {
        navigator.clipboard.writeText(window.location.href);
    }
    // const pagesRef = useRef([]);


    return (
        <Container>
            <TitleContainer>
                <Title>
                    {title}
                </Title>
                <ShareButton onClick={copyUrl}>
                    Share
                    <BsLink45Deg size={24}/>
                </ShareButton>
            </TitleContainer>
            <InnerContainer>
                <ViewerContainer>
                    {
                        fileType === 'pdf' && <PDFViewer/>
                    }
                    {
                        fileType === 'url' && <WebsiteViewer/>
                    }
                    {
                        fileType === 'youtube' && <YoutubeViewer/>
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