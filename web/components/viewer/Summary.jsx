import React, {useContext, useMemo} from 'react';
import styled, {keyframes} from "styled-components";
import {Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import SemanticSearch from "./SemanticSearch";
import CollapsibleSummary from "./CollapsibleSummary";
import {SmallAddIcon} from "@chakra-ui/icons";
import GenerateSummary from "./GenerateSummary";
import {ViewerContext} from "./context";

const Container = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  position: relative;
  border: 2px black solid;
  border-radius: 2px;
  height: 750px;
  background-color: #242933;
  color: #fbfbff;

  &:hover {
    box-shadow: 5px 5px 0px #000000;
    transition: box-shadow 0.1s ease-in-out;
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

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 999;

  animation: ${fadeIn} 1s ease-in-out;

  & > p {
    font-size: 1.5rem;
    color: #fbfbff;
    margin-top: 1rem;
    text-align: center;
  }
`;


const SubHeading = styled.div`
  font-weight: bold;
  font-size: 1.5rem;
  margin-top: 5px;
`
const SummaryText = styled.div`
`
const SummaryContainer = styled.div`
`


function Summary({}) {
    const {summary, pdfKey, fileType, isReady} = useContext(ViewerContext)


    return (
        <Container>
            {!isReady && (
                <LoadingOverlay>
                    <p>The document is being processed.</p>
                    <p>Please wait for some time for it to be ready.</p>
                </LoadingOverlay>
            )}

            <Tabs height={'100%'} variant='enclosed' isFitted>
                <TabList height={'5%'}>
                    <Tab style={{borderRadius: '0px'}} _selected={{color: 'white', bg: 'black'}}>Summary Hub</Tab>
                    <Tab style={{borderRadius: '0px'}} _selected={{color: 'white', bg: 'black'}}>Search</Tab>
                </TabList>

                <TabPanels height={'94%'}>
                    <TabPanel style={{height: '100%', padding: '0px'}}>
                        <SummaryContainer>
                            <GenerateSummary/>
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
        </Container>
    );
}

export default Summary;