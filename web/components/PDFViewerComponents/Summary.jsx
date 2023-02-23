import React, {useMemo} from 'react';
import styled from "styled-components";
import {Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import SemanticSearch from "./SemanticSearch";
import CollapsibleSummary from "./CollapsibleSummary";
import {SmallAddIcon} from "@chakra-ui/icons";
import GenerateSummary from "./GenerateSummary";

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


function Summary({summaryJson, uploadId}) {

    // const SummaryPanel = useMemo(() => {
    //     return <div>This is where the summary sits</div>
    //     let panelOutput = []
    //     for (let i = 0; i < summaryJson.length; i++) {
    //         console.log(summaryJson[i][2])
    //         for (let j = 0; j < summaryJson[i][2].length; j++) {
    //             panelOutput.push(
    //                 <>
    //                     <SubHeading key={`${i}-${j}-0`}>
    //                         {summaryJson[i][2][j][0]}
    //                     </SubHeading>
    //                     <SummaryText key={`${i}-${j}-1`}>
    //                         {summaryJson[i][2][j][1]}
    //                     </SummaryText>
    //                 </>
    //             )
    //         }
    //     }
    //     return panelOutput
    // }, [summaryJson]);

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
                            <CollapsibleSummary/>
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