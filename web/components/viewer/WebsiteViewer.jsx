import React, {useContext, useEffect, useState} from 'react';
import {ViewerContext} from "./context";
import axios from "axios";
import styled, {keyframes} from 'styled-components'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {Spinner} from "@chakra-ui/react";


const MarkdownWrapper = styled.div`
  position: relative;
  background-color: #282c34;
  color: #ffffff;
  padding: 20px;
  max-width: 100%;
  margin: 5px 10px 10px 10px;
  overflow: auto;
  height: 80vh;
  font-weight: 400;
  border: 2px solid black;
  border-radius: 4px;

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

  @media (max-width: 768px) {
    padding: 10px;
    height: 300px;
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

    const getDocumentDetails = (pdfKey) => {
        let params = {'key': pdfKey}
        axios.get('/api/user/get_url_document', {params: params}).then(res => {
            setSummary(res.data.documentDetails.summary)
            setIsReady(res.data.documentDetails.status === 'Ready')

        }).catch(err => {
            console.log(err)
        })
    }
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
        // let timer = setInterval(() => getDocumentDetails(pdfKey), 3000);
        // return () => {
        //     timer = null
        // }
    }, [pdfKey])
    return (
        <MarkdownWrapper>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
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