import React, {useContext, useEffect, useState} from 'react';
import {ViewerContext} from "./context";
import axios from "axios";
import styled from 'styled-components'

const StyledIframe = styled.iframe`
  width: 100%;
  padding: 5px 10px;
  height: 750px;
`

function WebsiteViewer() {
    const [url, setUrl] = useState('');
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
            setUrl(res.data.documentDetails.url)
            setSummary(res.data.documentDetails.summary)
            setTitle(res.data.documentDetails.title)
            setFileType(res.data.documentDetails.type)
        }).catch(err => {
            console.log(err)
        })
        let timer = setInterval(() => getDocumentDetails(pdfKey), 3000);
        return () => {
            timer = null
        }
    }, [pdfKey])
    return (
        <StyledIframe src={url}></StyledIframe>
    );
}

export default WebsiteViewer;