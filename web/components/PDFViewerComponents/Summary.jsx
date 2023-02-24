import React, {useContext, useMemo} from 'react';
import styled from "styled-components";
import {Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import SemanticSearch from "./SemanticSearch";
import CollapsibleSummary from "./CollapsibleSummary";
import {SmallAddIcon} from "@chakra-ui/icons";
import GenerateSummary from "./GenerateSummary";
import {PDFViewerContext} from "./context";

const Container = styled.div`
  //flex: 1;
  width: 40vw;
  overflow-y: auto;
  margin-top: 10px;
  margin-right: 20px;
  border: 2px black solid;
  border-radius: 3px;
  height: 750px;

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


function Summary({uploadId}) {
    const {summary} = useContext(PDFViewerContext)
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
                        <SemanticSearch uploadId={uploadId}/>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Container>
    );
}

export default Summary;