import React, {useContext, useMemo} from 'react';
import styled from "styled-components";
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

  border: 2px black solid;
  border-radius: 15px 3px 3px 3px;
  height: 750px;
  background-color: whitesmoke;

  &:hover {
    box-shadow: 5px 5px 0px #000000;
    transition: box-shadow 0.1s ease-in-out;
  }
`

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
    const {summary, pdfKey} = useContext(ViewerContext)
    return (
        <Container>
            <Tabs height={'100%'} variant='enclosed' isFitted>
                <TabList>
                    <Tab _selected={{color: 'white', bg: 'black'}}>Summary Hub</Tab>
                    <Tab _selected={{color: 'white', bg: 'black'}}>Search</Tab>
                </TabList>

                <TabPanels height={'94%'}>
                    <TabPanel style={{height: '100%', padding: '0px'}}>
                        <SummaryContainer>
                            <GenerateSummary/>
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