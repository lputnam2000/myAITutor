import React, {useContext, useEffect, useState} from 'react';
import {ViewerContext} from "./context";
import axios from "axios";
import styled from 'styled-components'
import ReactPlayer from 'react-player/youtube'

const Container = styled.div`
  width: 95%;
  margin-left: 20px;
  height: 750px;
  border: 2px black solid;

  &:hover {
    box-shadow: 5px 5px 0px #000000;
    transition: box-shadow 0.1s ease-in-out;
  }
  margin-bottom: 10px;
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
        console.log('called', pdfKey)
        if (!pdfKey) return
        let params = {'key': pdfKey}
        axios.get('/api/user/get_youtube_video', {params: params}).then(res => {
            console.log(res.data)
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
        console.log(url)
    }, [pdfKey])
    return (
       <Container>
           {url && <ReactPlayer width={'100%'} height={'100%'} controls={true}  url={url}/>}
       </Container>
    );
}

export default WebsiteViewer;