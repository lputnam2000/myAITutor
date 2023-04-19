import React, {useContext, useEffect, useMemo, useState} from 'react';
import styled, {keyframes} from 'styled-components'
import {IconButton, Spinner} from "@chakra-ui/react";
import {ChevronDownIcon, ChevronRightIcon, TriangleDownIcon, TriangleUpIcon} from "@chakra-ui/icons";
import {ViewerContext} from "./context";
import ReactMarkdown from 'react-markdown';
import {InlineMath, BlockMath} from 'react-katex';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';

const Container = styled.div`
  padding: 5px;
  display: grid;
  grid-template-columns: min-content 1fr;
  color: #DADADA;
  background-color: #29323C;
  margin: 5px 5px 10px 5px;
  border-radius: 3px;
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
  background-color: #969a96;

`

const StyledIconButton = styled(IconButton)`
  justify-self: center;
`

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;
const SummaryEntry = styled.span`
  animation: ${fadeIn} 0.6s ease-out both;
`;

const SubHeading = styled.div`
  font-weight: bold;
  font-size: 1.5rem;
  margin-top: 5px;
  @media (max-width: 550px) {
    font-size: 20px;
  }

`
const SummaryText = styled.div`
  margin-bottom: 5px;
  @media (max-width: 550px) {
    font-size: 14px;
  }
`

const LoadingSpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 40px;
  gap: 10px;
`

function LoadingSpinner() {
    return (
        <LoadingSpinnerContainer>
            <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='#48fdce'
                size='xl'
            />
            🦍🍌📚
        </LoadingSpinnerContainer>
    )
}

const MarkdownWrapper = styled.div`
  position: relative;
  color: #DADADA;
  max-width: 100%;
  font-weight: 400;
  border-radius: 4px;
  font-size: 16px;
  background-color: #29323C;
  overflow-wrap: break-word;
  word-wrap: break-word;

  h1, h2, h3 {
    font-size: 22px;
  }

  h1, h2, h3, h4, h5, h6 {
    color: #C6A9F6;
  }

  strong {
    color: #ffdb58;
    padding: 1px 4px;
    font-weight: 500;
  }

  code {
    color: #7BF15B;
    background-color: #1E2732;
    padding: 0.1em 0.3em;
    border-radius: 3px;
  }

  pre {
    background-color: #1E2732;
    padding: 1em;
    border-radius: 5px;
  }

  ul {
    margin-left: 20px;
    list-style-type: disc;
  }

  ol {
    margin-left: 20px;
    list-style-type: decimal;
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }

  th, td {
    border: 1px solid #536877;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #39434C;
  }

  tr:nth-child(even) {
    background-color: #2E3541;
  }

  @media (max-width: 900px) {
    padding: 10px;
  }
  @media (max-width: 550px) {
    padding: 10px;
    font-size: 14px;
    h1, h2, h3 {
      font-size: 20px;
    }
  }
`;

const renderers = {
    inlineMath: ({value}) => <InlineMath math={value}/>,
    math: ({value}) => <BlockMath math={value}/>,
    code: ({language, value}) => (
        <pre>
      <code>
        {value}
      </code>
    </pre>
    ),
};


function CollapsibleSummary({summaryJson, isOpen, fileType, isStreaming = false}) {
    const [open, setOpen] = useState(isOpen);
    const {liveSummary} = useContext(ViewerContext)
    console.log(liveSummary)
    const SummaryPanel = useMemo(() => {
        console.log('json', summaryJson)
        let panelOutput = []
        let formattedSummary = summaryJson.formattedSummary
        for (let i = 0; i < formattedSummary.length; i++) {
            if (!formattedSummary[i][2]) continue;
            panelOutput.push(
                <SummaryEntry key={`number-${i}`}>
                    <MarkdownWrapper>
                        <ReactMarkdown
                            remarkPlugins={[remarkMath, remarkGfm]}
                            rehypePlugins={[rehypeKatex]}
                            components={renderers}
                        >
                            {formattedSummary[i][2]}
                        </ReactMarkdown>
                    </MarkdownWrapper>
                </SummaryEntry>
            )
        }
        return panelOutput
    }, [summaryJson]);

    const heading = useMemo(() => {
        if (fileType === 'pdf') {
            return `Summary for Pages ${summaryJson.startPage}-${summaryJson.endPage}`
        } else if (fileType === 'youtube') {
            return `Youtube Video Summary`
        } else {
            return `Website Summary`
        }
    }, [summaryJson, fileType]);

    return (
        <Container>
            <StyledIconButton backgroundColor={'#242933'} variant='outline'
                              _focus={{
                                  boxShadow: "0 0 0 3px rgba(36, 41, 51, 0.6)", // Custom focus ring color
                              }}
                              _hover={{
                                  backgroundColor: "#2D3542", // Custom hover background color
                                  borderColor: "#2D3542", // Custom hover border color
                                  color: "#FFF", // Custom hover text/icon color
                              }} aria-label='Expand Summary' onClick={() => setOpen(!open)}
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
                    {isStreaming && <LoadingSpinner/>}
                </SummaryText>
            </>}
        </Container>
    );
}

export default CollapsibleSummary;