import React, {useMemo, useContext, useEffect, useRef} from 'react';
import styled from "styled-components";
import {Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import { PDFViewerContext } from "./context";

const Container = styled.div`
  //flex: 1;
  width: 40vw;
  overflow-y: auto;
  margin-right: 20px;
  border: 2px black solid;
  border-radius: 3px;
  height: 750px;

  &:hover {
    box-shadow: 5px 5px 0px #000000;
    transition: box-shadow 0.1s ease-in-out;
  }
  overflow: hidden;
`

const SubHeading = styled.div`
  font-weight: bold;
  font-size: 1.5rem;
  margin-top: 5px;
`
const SummaryText = styled.div`
`
const SummaryContainer = styled.div`
  overflow: scroll;
  max-height: 100vh;
`

function Summary({summaryJson}) {
    const {scrollPosition} = useContext(PDFViewerContext);
    const summaryContainerRef = useRef();

    function handleSummaryScroll(e) {
        console.log("hello ")
    }

    useEffect(
        () => {
            //Nop for now
        }
        , [scrollPosition]
    );

    const SummaryPanel = useMemo(() => {
        let panelOutput = []
        for (let i = 0; i < summaryJson.length; i++) {
            console.log(summaryJson[i][2])
            for (let j = 0; j < summaryJson[i][2].length; j++) {
                panelOutput.push(
                    <>
                        <SubHeading key={`${i}-${j}-0`}>
                            {summaryJson[i][2][j][0]}
                        </SubHeading>
                        <SummaryText key={`${i}-${j}-1`}>
                            {summaryJson[i][2][j][1]}
                        </SummaryText>
                    </>
                )
            }
        }
        return panelOutput
    }, [summaryJson]);

    return (
        <Container>
            <Tabs variant='enclosed' isFitted>
                <TabList>
                    <Tab _selected={{color: 'white', bg: 'black'}}>Summary</Tab>
                    <Tab _selected={{color: 'white', bg: 'black'}}>Search</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <SummaryContainer ref={summaryContainerRef} onScroll={handleSummaryScroll}>
                            {SummaryPanel}
                        </SummaryContainer>
                    </TabPanel>
                    <TabPanel>
                        <p>Search</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Container>
    );
}

export default Summary;