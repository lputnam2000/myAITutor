import React, {useContext, useEffect, useState} from 'react';
import {ViewerContext} from "./context";
import axios from "axios";
import styled from 'styled-components'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


const MarkdownWrapper = styled.div`
  background-color: #282c34;
  color: #ffffff;
  padding: 20px;
  max-width: 100%;
  margin: 0 auto;
  overflow: auto;
  height: 80vh;
  font-weight: 400;

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

function WebsiteViewer() {
    const [markdown, setMarkdown] = useState(`
# Hello World!

Some text here with an [example link](https://example.com).

![Placeholder image](images/placeholder-150.png)

| Header 1    | Header 2    |
| ----------- | ----------- |
| Row 1, Cell 1 | Row 1, Cell 2 |
| Row 2, Cell 1 | Row 2, Cell 2 |
`);
    const {setSummary, setTitle, setFileType, pdfKey} = useContext(ViewerContext);

    const getDocumentDetails = (pdfKey) => {
        let params = {'key': pdfKey}
        axios.get('/api/user/get_url_document', {params: params}).then(res => {
            setSummary(res.data.documentDetails.summary)
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
        }).catch(err => {
            console.log(err)
        })
        let timer = setInterval(() => getDocumentDetails(pdfKey), 3000);
        return () => {
            timer = null
        }
    }, [pdfKey])
    return (
        <MarkdownWrapper>
            <ReactMarkdown remarkPlugins={[remarkGfm]} children={markdown}/>
        </MarkdownWrapper>
    );
}

export default WebsiteViewer;