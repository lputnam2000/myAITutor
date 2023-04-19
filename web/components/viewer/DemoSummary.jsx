import React from 'react';
import {Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import SemanticSearch from "../search/SemanticSearch";
import CollapsibleSummary from "./CollapsibleSummary";
import styled, {keyframes, css} from "styled-components";


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


const SummaryContainer = styled.div`
`


function Summary({pdfKey, summary}) {
    return (
        <Container>
            <Tabs height={'100%'} variant='enclosed' isFitted>
                <TabList height={'35px'}>
                    <Tab style={{borderRadius: '0px'}} _selected={{color: 'white', bg: 'black'}}>Summary Hub</Tab>
                    <Tab style={{borderRadius: '0px'}} _selected={{color: 'white', bg: 'black'}}>Search</Tab>
                </TabList>
                <TabPanels height={'calc(100%-35px)'}>
                    <TabPanel style={{height: '100%', padding: '0px', marginRight: '10px'}}>
                        <SummaryContainer>
                            {
                                summary.map((s, idx) => <CollapsibleSummary isOpen={idx === 0} key={idx}
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