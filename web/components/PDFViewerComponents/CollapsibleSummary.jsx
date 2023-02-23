import React, {useMemo, useState} from 'react';
import Summary from '../../public/summary.json'
import styled from 'styled-components'
import {IconButton} from "@chakra-ui/react";
import {ChevronDownIcon, ChevronRightIcon, TriangleDownIcon, TriangleUpIcon} from "@chakra-ui/icons";


const Container = styled.div`
  padding: 5px;
  display: grid;
  grid-template-columns: min-content 1fr;
`

const Heading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const HeadingText = styled.span`
  font-size: 18px;
  font-weight: 600;
  margin-left: 5px;
`
const SummaryContainer = styled.div`
  display: flex;

`
const CloseBorderContainer = styled.div`
  justify-self: center;
  cursor: pointer;
  display: inline-block;
  padding-left: 5px;
  padding-right: 5px;
`
const CloseBorder = styled.div`
  width: 3px;
  height: 100%;
  background-color: #23b7eb;

`

const SubHeading = styled.div`
  font-weight: bold;
  font-size: 1.5rem;
  margin-top: 5px;

`
const SummaryText = styled.div`
`

const StyledIconButton = styled(IconButton)`
  justify-self: center;
`


function CollapsibleSummary(props) {
    const [open, setOpen] = useState(true);

    let summaryJson = Summary;
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


    let metadata = {startLoc: 1, endLoc: 5}
    const heading = useMemo(() => {
        return `Summary for Pages ${metadata.startLoc}-${metadata.endLoc}`
    }, [metadata]);

    return (
        <Container>
            <StyledIconButton aria-label='Expand Summary' onClick={() => setOpen(!open)}
                              icon={
                                  open ?
                                      <ChevronDownIcon boxSize={6}/>
                                      :
                                      <ChevronRightIcon boxSize={6}/>
                              }/>
            <Heading>
                <HeadingText>{heading}</HeadingText>
            </Heading>
            {open && <>
                <CloseBorderContainer onClick={() => setOpen(!open)}>
                    <CloseBorder>
                    </CloseBorder>
                </CloseBorderContainer>
                <SummaryText>
                    {SummaryPanel}
                </SummaryText>
            </>}
        </Container>
    );
}

export default CollapsibleSummary;