import React, {useContext, useEffect, useMemo, useState} from 'react';
import styled, {keyframes, css} from "styled-components";
import {Spinner, Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import SemanticSearch from "./SemanticSearch";
import CollapsibleSummary from "./CollapsibleSummary";
import GenerateSummary from "./GenerateSummary";
import {ViewerContext} from "./context";

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
    box-shadow: 5px 5px 0px #48fdce;
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
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  animation: ${fadeIn} 1s ease-in-out;
`;
const LoadingText = styled.div`
  padding-left: 10px;
  font-size: 1.2rem;
  color: #48fdce;
  margin-left: 10px;
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
const SpinnerWrapper = styled.div`
  width: 30px;
  margin-left: 10px;
  margin-right: 10px;
`

function LoadingContainer({}) {
    const [jokeNumber, setJokeNumber] = useState(0);
    const [fade, setFade] = useState(true);

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
            <SpinnerWrapper>
                <Spinner
                    thickness='4px'
                    speed='0.6s'
                    emptyColor='gray.200'
                    color='#48fdce'
                    size='xl'
                />
            </SpinnerWrapper>

            <LoadingText>Chewing through the info jungle, hang tight! 🌿🦍 &nbsp;
                <Joke fade={fade}>{loadingTexts[jokeNumber]}</Joke></LoadingText>
        </LoadingDiv>
    )
}

function Summary({}) {
    const {summary, pdfKey, fileType, isReady, liveSummary} = useContext(ViewerContext)


    return (
        <Container>
            {!isReady ? (
                    <LoadingContainer/>
                ) :

                <Tabs height={'100%'} variant='enclosed' isFitted>
                    <TabList height={'35px'}>
                        <Tab style={{borderRadius: '0px'}} _selected={{color: 'white', bg: 'black'}}>Summary Hub</Tab>
                        <Tab style={{borderRadius: '0px'}} _selected={{color: 'white', bg: 'black'}}>Search</Tab>
                    </TabList>

                    <TabPanels height={'calc(100%-35px)'}>
                        <TabPanel style={{height: '100%', padding: '0px', marginRight: '10px'}}>
                            <SummaryContainer>
                                <GenerateSummary/>
                                {
                                    liveSummary.isSummarizing &&
                                    <CollapsibleSummary fileType={fileType} isOpen={true}
                                                        summaryJson={liveSummary.summaryJson} isStreaming={true}/>
                                }
                                {
                                    summary.map((s, idx) => <CollapsibleSummary fileType={fileType} isOpen={idx === 0}
                                                                                key={idx}
                                                                                summaryJson={s}/>)
                                }
                                {/*{SummaryPanel}*/}
                            </SummaryContainer>
                        </TabPanel>
                        <TabPanel style={{height: '100%'}}>
                            <SemanticSearch uploadId={pdfKey}/>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            }
        </Container>
    );
}

export default Summary;