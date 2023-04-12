import React, {useContext, useEffect, useState, useRef} from 'react';
import {ViewerContext} from "./context";
import axios from "axios";
import styled from 'styled-components'
import ReactPlayer from 'react-player/youtube'

const Container = styled.div`
  position: relative;
  height: 0;
  border: 2px black solid;
  padding-bottom: 56.25%;

  &:hover {
    box-shadow: 5px 5px 0px #000000;
    transition: box-shadow 0.1s ease-in-out;
  }

  margin-bottom: 10px;
`;

const PlayerWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

function YoutubeViewer() {
    const [url, setUrl] = useState('');
    const {
        setSummary,
        setTitle,
        setProgress,
        setProgressMessage,
        setFileType,
        pdfKey,
        setGoToContextYoutube,
        setLiveSummary,
        setAnswers
    } = useContext(ViewerContext);
    const playerRef = useRef();

    useEffect(() => {
        if (!pdfKey) return
        let params = {'key': pdfKey}
        axios.get('/api/user/get_youtube_video', {params: params}).then(res => {
            setUrl(res.data.documentDetails.url)
            setSummary(res.data.documentDetails.summary)
            setTitle(res.data.documentDetails.title)
            setFileType(res.data.documentDetails.type)
            setProgress(res.data.documentDetails.progress)
            setProgressMessage(res.data.documentDetails.progressMessage)
            setLiveSummary(res.data.documentDetails.liveSummary)
            setAnswers(res.data.documentDetails.answers)
        }).catch(err => {
            console.log(err)
        })

    }, [setSummary, setAnswers, setLiveSummary, setTitle, setFileType, pdfKey, setProgress, setProgressMessage])

    useEffect(() => {
        if (playerRef.current) {
            setGoToContextYoutube(() => (seconds) => {
                playerRef.current.seekTo(seconds, 'seconds')
            })
        }
    }, [playerRef, setGoToContextYoutube, playerRef.current]);


    return (
        <Container>
            {url && <PlayerWrapper>
                <ReactPlayer ref={playerRef} width={'100%'} height={'100%'} controls={true} url={url}/>
            </PlayerWrapper>
            }

        </Container>
    );
}

export default YoutubeViewer;