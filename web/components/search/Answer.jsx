import React, {useContext, useState, useCallback, useMemo} from 'react';
import styled from 'styled-components';
import {ViewerContext} from "../viewer/context";
import {ChevronUpIcon, ChevronDownIcon} from "@chakra-ui/icons";
import Image from 'next/image'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-bottom: 1rem;
  border: solid;
  border-width: 1px;
  border-color: rgb(0, 0, 0, 0.1);
  border-radius: 3px;
  margin-top: 5px;
`;

const Question = styled.div`
  font-size: 14px;
  letter-spacing: .3px;
  color: #000;
  border-radius: 5px;
  padding: 5px;
  font-weight: 600;
  background-color: #48fdce;
`;

const Answer = styled.div`
  border-radius: 5px;
  color: #fff;
  background-color: #1c2025;
  padding: 10px;

`;

const MonkeyProfileImage = styled(Image)`
  float: left;
  margin-right: 5px;
  border: 2px solid black;
`
const ContextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-top: 0.5rem;
`;


const ExpandButton = styled.button`
  background-color: #1c2025;
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem;
  margin-top: 0.5rem;
  cursor: pointer;
`;

const ContextHeading = styled.h3`
  color: #ffdb58;
  font-weight: 400;
  font-size: 18px;
  @media (max-width: 600px) {
    font-size: 16px;
  }
`

const ContextContainer = styled.div`
  background-color: #1c2025;
  padding: 0.5rem;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
  @media (max-width: 600px) {
    font-size: 12px;
  }
  display: flex;
`;

function formatSeconds(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.round(seconds % 60);
    let formattedTime = '';
    if (hours > 0) {
        formattedTime += `${hours}:`;
    }
    formattedTime += `${minutes.toString().padStart(1, '0')}:`;
    formattedTime += `${remainingSeconds.toString().padStart(2, '0')}`;
    return formattedTime;
}

const IndexTagContainer = styled.span`
  background-color: black;
  cursor: pointer;
  color: #26f626;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  padding: 3px;
  margin: 4px 4px 4px 0px;
  height: min-content;
`

const IndexTag = ({context, index}) => {
    const {goToContext, fileType} = useContext(ViewerContext);

    return <IndexTagContainer onClick={() => goToContext(context)}>
        {(fileType === 'mp4' || fileType === 'youtube') ? formatSeconds(context.start_time)
            : ((fileType === 'pdf') ? `[Page: ${context.start_page}]` : `[${index}]`)
        }
    </IndexTagContainer>
}

const ParagraphContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const ParagraphText = styled.p`
  overflow: hidden;
  position: relative;
`;

const ExpandArrow = styled.button`
  background: transparent;
  border: none;
  margin-top: 10px;
  height: 30px;
  width: 100%;

  &:hover {
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.3); /* Add box shadow property here */
  }
`;

const ParagraphComponent = ({text}) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <ParagraphContainer>
            <ParagraphText>
                {expanded ? (
                    <>
                        {text}
                        <ExpandArrow onClick={() => {
                            setExpanded(false)
                        }}>
                            <ChevronUpIcon/>
                        </ExpandArrow>
                    </>
                ) : (
                    <>
                        {text.slice(0, 150)}...{/* Adjust character limit as needed */}
                        <ExpandArrow onClick={() => {
                            setExpanded(true)
                        }}>
                            <ChevronDownIcon/>
                        </ExpandArrow>
                    </>
                )}
            </ParagraphText>
        </ParagraphContainer>
    );
};


const Context = ({context, fileType, index}) => {

    return <ContextContainer>
        <IndexTag context={context} index={index}/>
        <ParagraphComponent text={context.text}>
        </ParagraphComponent>
    </ContextContainer>
}


const stringToSeconds = (time) => {
    console.log(time)
    const timeParts = time.split(':');
    let seconds = 0;

    if (timeParts.length === 3) {
        seconds += parseInt(timeParts[0], 10) * 3600; // Hours
        seconds += parseInt(timeParts[1], 10) * 60; // Minutes
        seconds += parseInt(timeParts[2], 10); // Seconds
    } else if (timeParts.length === 2) {
        seconds += parseInt(timeParts[0], 10) * 60; // Minutes
        seconds += parseInt(timeParts[1], 10); // Seconds
    }

    return seconds;
};

const tagToLabel = {
    'q&a': 'Q & A',
    'learn': 'Explain',
}

export default function AnswerBox({question, answer, contexts, answerElem}) {
    const [showContexts, setShowContexts] = useState(false);

    const toggleContexts = () => {
        setShowContexts(!showContexts);
    };

    const renderedAnswer = useCallback((answer, contexts) => {
        console.log(answer)
        console.log(contexts)
        const numberRegex = /\{(\d+)\}/g;

        const parts = answer.split(numberRegex);
        console.log(parts)
        return parts.map((part, index) => {
            if (index % 2 === 1) {
                const number = parseInt(part, 10);
                console.log(number)
                return (
                    <IndexTag key={index} index={number} context={contexts[number - 1]}>
                        {number}
                    </IndexTag>
                );
            }
            return part;
        });
    }, [])

    return (
        <Wrapper>
            <Question>{tagToLabel[answerElem.questionTagSelected]}:&nbsp;{question}</Question>
            <Answer><MonkeyProfileImage src={'/monkeyProfile.png'} height={40}
                                        width={40}/>
                {renderedAnswer(answer, contexts)}
            </Answer>
            <ExpandButton onClick={toggleContexts}>
                {showContexts ? 'Hide Contexts Used' : 'Show Contexts Used'}
            </ExpandButton>
            {showContexts && (
                <ContextWrapper>
                    <ContextHeading>Contexts used to respond:</ContextHeading>
                    {contexts.map((context, index) => (
                        <Context key={index} index={index + 1} context={context}></Context>
                    ))}
                </ContextWrapper>
            )}
            {showContexts && <ExpandButton onClick={toggleContexts}>
                {showContexts ? 'Hide Contexts Used' : 'Show Contexts Used'}
            </ExpandButton>}
        </Wrapper>
    );
};