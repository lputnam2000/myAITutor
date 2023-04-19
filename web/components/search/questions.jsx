import React from 'react';
import {Textarea} from "@chakra-ui/react";
import styled from 'styled-components'

const Heading = styled.div`
  margin: 0px 5px;
  color: #ffe135;
  font-family: var(--font-b);
  font-weight: 700;
  font-size: 30px;
  text-decoration: underline;
  letter-spacing: .3px;
  border-radius: 20px;
  transition: background-color 400ms ease;
  height: min-content;
`
const QuestionContainer = styled.div`
  display: flex;
`

export function QandA({searchQuery, setSearchQuery, children}) {
    return (
        <>
            <Heading>
                Q & A
            </Heading>
            <QuestionContainer>

                <Textarea style={{borderColor: '#57657e'}} value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={'Type your question here using clear and specific wording for the best results. For example, \'What is the capital of France?\' or \'How do I cook a perfect omelette?'}
                />
                {children}
            </QuestionContainer>

        </>
    );
}


export function Explain({searchQuery, setSearchQuery, children}) {
    return (
        <>
            <Heading>
                Explain
            </Heading>
            <QuestionContainer>
                <Textarea style={{borderColor: '#57657e'}} value={searchQuery}
                          noOfLines={1}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={'Enter a topic or concept here, and we\'ll provide a clear and concise explanation. For example, \'Explain photosynthesis\' or \'How does a car engine work?\''}
                />
                {children}
            </QuestionContainer>
        </>
    );
}

