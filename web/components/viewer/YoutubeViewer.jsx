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

function YoutubeViewer() {
    const [url, setUrl] = useState('');
    const {setSummary, setTitle, setFileType, pdfKey, setIsReady} = useContext(ViewerContext);

    const getDocumentDetails = (pdfKey) => {
        let params = {'key': pdfKey}
        axios.get('/api/user/get_youtube_video', {params: params}).then(res => {
            setSummary(res.data.documentDetails.summary)
            setIsReady(res.data.documentDetails.status === 'Ready')
        }).catch(err => {
            console.log(err)
        })
    }
    useEffect(() => {
        if (!pdfKey) return
        let params = {'key': pdfKey}
        axios.get('/api/user/get_youtube_video', {params: params}).then(res => {
            setUrl(res.data.documentDetails.url)
            setSummary(res.data.documentDetails.summary)
            setTitle(res.data.documentDetails.title)
            setFileType(res.data.documentDetails.type)
            setIsReady(res.data.documentDetails.status === 'Ready')
        }).catch(err => {
            console.log(err)
        })
        let timer = setInterval(() => getDocumentDetails(pdfKey), 3000);
        return () => {
            timer = null
        }
    }, [pdfKey])
    return (
        <Container>
            {url && <ReactPlayer width={'100%'} height={'100%'} controls={true} url={url}/>}
        </Container>
    );
}

export default YoutubeViewer;