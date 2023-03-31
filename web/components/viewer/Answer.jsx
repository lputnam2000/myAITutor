import React, {useState} from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-bottom: 1rem;
  border: solid;
  border-width: 1px;
  border-color: rgb(0, 0, 0, 0.1);
  border-radius: 3px;
`;

const Question = styled.div`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Answer = styled.div`
  margin-bottom: 1rem;
`;

const ContextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-top: 0.5rem;
`;

const Context = styled.div`
  background-color: #1c2025;
  padding: 0.5rem;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
`;

const ExpandButton = styled.button`
  background-color: #1c2025;
  border: none;
  border-radius: 0.25rem;
  padding: 0.5rem;
  margin-top: 0.5rem;
  cursor: pointer;
`;

export default function AnswerBox({question, answer, contexts}) {
    const [showContexts, setShowContexts] = useState(false);

    const toggleContexts = () => {
        setShowContexts(!showContexts);
    };

    return (
        <Wrapper>
            <Question>{question}</Question>
            <Answer>{answer}</Answer>
            {showContexts && (
                <ContextWrapper>
                    <h2>Contexts used to respond:</h2>
                    {contexts.map((context, index) => (
                        <Context key={index}>{context.text}</Context>
                    ))}
                </ContextWrapper>
            )}
            <ExpandButton onClick={toggleContexts}>
                {showContexts ? 'Hide Contexts Used' : 'Show Contexts Used'}
            </ExpandButton>
        </Wrapper>
    );
};