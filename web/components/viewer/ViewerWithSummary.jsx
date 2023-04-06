import React, {useContext, useEffect, useState} from 'react';
import styled from "styled-components";
import {ViewerContext} from "./context";
import Summary from "./Summary";
import PDFViewer from "./PDFViewer";
import {BsLink45Deg} from 'react-icons/bs'
import WebsiteViewer from "./WebsiteViewer";
import YoutubeViewer from "./YoutubeViewer";
import VideoViewer from './VideoViewer';


const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 10px;
  flex-grow: 1;
  width: 100%;
`


const InnerContainer = styled.div`
  display: flex;
  width: 100%;
  flex-grow: 1;
  @media (min-width: 900px) {
    flex-direction: row;
    align-items: stretch
  }
  flex-direction: column;
  align-items: stretch;
`


const TitleContainer = styled.h1`
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  color: #48fdce;
  justify-content: space-between;
`

const Title = styled.span`
  font-size: 40px;
  white-space: nowrap;
  text-overflow: ellipsis;

  overflow: hidden;
  @media (max-width: 900px) {
    font-size: 25px;
  }
  @media (max-width: 550px) {
    font-size: 20px;
  }

`

const ShareButton = styled.button`
  font-size: 18px;
  font-weight: 600;
  margin-left: 20px;
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
  @media (max-width: 900px) {
    font-size: 16px;
  }
  @media (max-width: 550px) {
    font-size: 14px;
  }
`

const ViewerContainer = styled.div`
  flex: 1;
  margin: 10px;
`

const SummaryContainer = styled.div`
  margin: 10px 10px 10px 10px;
  position: relative;
  @media (max-width: 899px) {
    height: 450px;
  }
  @media (min-width: 900px) {
    width: 40vw;
    margin: 10px 10px 10px 0px;
  }
`


function ViewerWithSummary({href}) {

    const {title, fileType} = useContext(ViewerContext);


    const copyUrl = () => {
        navigator.clipboard.writeText(window.location.href);
    }


    return (
        <Container>
            <TitleContainer>
                <Title>
                    {title}
                </Title>
                <ShareButton onClick={copyUrl}>
                    Share
                    <BsLink45Deg size={22}/>
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
                    {
                        fileType === 'mp4' && <VideoViewer/>
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