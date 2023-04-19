import React, {useContext, useEffect, useMemo, useState} from 'react';
import styled, {keyframes, css} from "styled-components";
import {Progress, Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import SemanticSearch from "../search/SemanticSearch";
import CollapsibleSummary from "./CollapsibleSummary";
import GenerateSummary from "./GenerateSummary";
import {ViewerContext} from "./context";
import {WebsocketContext} from "./../WebsocketContext";

const Container = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  overflow: auto;
  border: 2px #57657e solid;
  border-radius: 2px;
  background-color: #242933;
  color: #fbfbff;
  transition: box-shadow 0.1s ease-in-out;

  &:hover {
    box-shadow: 5px 5px 0px #ffe135;
  }
`

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;


const LoadingDiv = styled.div`
  position: absolute;
  padding-left: 10px;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  height: 100%;
  animation: ${fadeIn} 1s ease-in-out;
`;
const LoadingText = styled.div`
  font-size: 1.2rem;
  color: #48fdce;
  margin-right: 10px;
`;


const SummaryContainer = styled.div`
`

const Joke = styled.div`
  opacity: 0;
  transition: opacity 1s ease-in-out;
  color: #20ee5f;
  font-size: 16px;
  ${(props) =>
          props.fade &&
          css`
            opacity: 1;
          `}
`
const ProgressMessage = styled.div`
  margin-top: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #20ee5f;
`
const ProgressContainer = styled.div`
  width: 100%;
  padding-right: 10px;
`

function LoadingContainer({}) {
    const {pdfKey, progress, setProgress, progressMessage, setProgressMessage} = useContext(ViewerContext)

    const [jokeNumber, setJokeNumber] = useState(0);
    const [fade, setFade] = useState(true);
    const {socket} = useContext(WebsocketContext);

    useEffect(() => {
        if (!socket) return;
        if (pdfKey === '') return

        const handleProgress = (data) => {
            let jsonData = JSON.parse(data)
            setProgress(jsonData.value)
            setProgressMessage(jsonData.text)
            console.log('Received data', data)
        }

        socket.on(`${pdfKey}:progress`, handleProgress);

        // Clean up the listener when the component is unmounted
        return () => {
            socket.off(`${pdfKey}:progress`, handleProgress);
        };
    }, [socket, pdfKey]);
    const loadingTexts = [
        'Why does it take a while for our chimp to preprocess your document? It\'s got its paws full juggling all those pages!',
        'Chimps might be great at climbing trees, but they\'re not the fastest learners. Hang tight while we process your document!',
        'Hang in there while we process your document. It might be taking a while, but trust us, we are not monkeying around!',
        'Our chimp\'s are making there way through your data, one banana break at a time! Thanks for your patience.',
        'Patience is key when you\'re a chimp dealing with important information. Stick around while we swing our way through your content!'
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setJokeNumber(Math.floor(Math.random() * loadingTexts.length));
                setFade(true);
            }, 1000);
        }, 30000);
        return () => clearInterval(interval);
    }, [loadingTexts.length]);

    return (<LoadingDiv>
            <LoadingText>Chewing through the info jungle, hang tight! 🌿🦍 &nbsp;
                <Joke fade={fade}>{loadingTexts[jokeNumber]}</Joke></LoadingText>
            <ProgressMessage>
                {progressMessage}
            </ProgressMessage>
            <ProgressContainer>
                <Progress size='xs' width={'100%'} value={progress} backgroundColor={"gray.500"}
                          colorScheme='pink'/>
            </ProgressContainer>
        </LoadingDiv>
    )
}

function Summary({}) {
    const {summary, pdfKey, fileType, liveSummary, progress} = useContext(ViewerContext)


    return (
        <Container>
            {progress !== 100 ? (
                    <LoadingContainer/>
                ) :

                <Tabs height={'100%'} variant='enclosed' isFitted>
                    <TabList height={'35px'} style={{borderBottom: '2px solid  #000'}}>
                        <Tab style={{color: '#ffe135'}}
                             _selected={{color: '#ffe135', bg: 'black'}}>AI
                            Assistant</Tab>
                        <Tab style={{color: '#ffe135'}}
                             _selected={{color: '#ffe135', bg: 'black'}}>Summaries</Tab>

                    </TabList>

                    <TabPanels height={'calc(100%-35px)'}>
                        <TabPanel style={{height: '100%', padding: '5px',}}>
                            <SemanticSearch uploadId={pdfKey}/>
                        </TabPanel>
                        <TabPanel style={{height: '100%', padding: '0px', marginRight: '10px'}}>
                            <SummaryContainer>
                                <GenerateSummary/>
                                {
                                    (liveSummary && Object.keys(liveSummary).length !== 0) &&
                                    <CollapsibleSummary fileType={fileType} isOpen={true}
                                                        summaryJson={liveSummary} isStreaming={true}/>
                                }
                                {
                                    summary.map((s, idx) => <CollapsibleSummary fileType={fileType} isOpen={idx === 0}
                                                                                key={idx}
                                                                                summaryJson={s}/>)
                                }
                                {/*{SummaryPanel}*/}
                            </SummaryContainer>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            }
        </Container>
    );
}

export default Summary;