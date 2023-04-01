import React, {useContext, useEffect, useState} from 'react';
import {ViewerContext} from "./context";
import axios from "axios";
import styled, {keyframes} from 'styled-components'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {Spinner} from "@chakra-ui/react";


const MarkdownWrapper = styled.div`
  height: 100%;
  position: relative;
  background-color: #282c34;
  color: #ffffff;
  max-width: 100%;
  font-weight: 400;
  border: 2px solid #57657e;
  border-radius: 4px;
  font-size: 16px;

  h1, h2, h3 {
    font-size: 24px;
  }

  h1, h2, h3, h4, h5, h6 {
    color: #e692fd;
  }

  strong {
    color: #A75EEFFF;
    font-weight: 500;
  }

  code {
    color: #60f616;
    background-color: #111418;
    padding: 0.1em 0.3em;
    border-radius: 3px;
  }

  pre {
    background-color: #111418;
    padding: 1em;
    border-radius: 5px;
  }

  @media (max-width: 900px) {
    padding: 10px;
    height: 450px;
  }
  @media (max-width: 550px) {
    padding: 10px;
    height: 300px;
    font-size: 14px;
    h1, h2, h3 {
      font-size: 20px;
    }
  }

  transition: box-shadow 0.1s ease-in-out;

  &:hover {
    box-shadow: 5px 5px 0px #48fdce;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const LoadingDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  animation: ${fadeIn} 1s ease-in-out;
`;
const LoadingText = styled.p`
  padding-left: 10px;
  font-size: 1.2rem;
  color: #48fdce;
`;

const ContentWrapper = styled.div`
  position: absolute;
  width: calc(100% - 12px);
  top: 5px;
  left: 10px;
  bottom: 5px;
  overflow: auto;
`

function WebsiteViewer() {
    const [markdown, setMarkdown] = useState('');
    const {
        setSummary,
        setTitle,
        setFileType,
        pdfKey,
        setIsReady,
        setIsWebsiteReady,
        isWebsiteReady
    } = useContext(ViewerContext);

    useEffect(() => {
        if (!pdfKey) return
        let params = {'key': pdfKey}
        axios.get('/api/user/get_url_document', {params: params}).then(res => {
            setSummary(res.data.documentDetails.summary)
            setTitle(res.data.documentDetails.title)
            setFileType(res.data.documentDetails.type)
            setMarkdown(res.data.documentDetails.content)
            setIsWebsiteReady(res.data.documentDetails.isWebsiteReady)
            setIsReady(res.data.documentDetails.status === 'Ready')

        }).catch(err => {
            console.log(err)
        })
    }, [pdfKey, setSummary, setTitle, setFileType, setMarkdown, setIsWebsiteReady, setIsReady])
    return (
        <MarkdownWrapper>
            <ContentWrapper>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
            </ContentWrapper>
            {!isWebsiteReady && <LoadingDiv>
                <Spinner
                    thickness='4px'
                    speed='0.6s'
                    emptyColor='gray.200'
                    color='#48fdce'
                    size='xl'
                />
                <LoadingText>Getting Website Contents!</LoadingText>
            </LoadingDiv>
            }
        </MarkdownWrapper>

    );
}

export default WebsiteViewer;