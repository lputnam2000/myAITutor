import React, {useContext, useState} from 'react';
import styled from 'styled-components'
import {Textarea} from '@chakra-ui/react'
import axios from "axios";
import AnswerBox from "./Answer"
import {Spinner} from "@chakra-ui/react";
import {ViewerContext} from "./context";

const Container = styled.div`
  height: 100%;
`
const SearchInputContainer = styled.div`
  margin-bottom: 5px;
  padding-bottom: 5px;
  border-bottom: 1px solid #57657e;
`
const SearchButton = styled.button`
  background-color: ${({isSearchDisabled, theme}) => isSearchDisabled ? 'gray' : theme.colors.secondary};
  cursor: ${({isSearchDisabled, theme}) => isSearchDisabled ? 'not-allowed' : 'pointer'};
  color: white;
  padding: 4px 9px;
  border-radius: 4px;

  &:focus {
    background-color: #464846;
  }
`

const AnswerContainer = styled.div`
  border-top: 2px solid black;
`

const PreviousSearches = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const LoadingSpinner = styled.div`
  padding: 3px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;

`

const demoSearch = new Set([
    '136fe416-d18f-4051-9d5c-c2692fdcd50f'
])

const SearchWithTags = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  gap: 10px;
`

const QuestionTypeTag = styled.button`
  background-color: ${(props) => props.isSelected ? '#90f58d' : '#f58dc5'};
  padding: 2px 10px;
  border-radius: 20px;
  color: #242933;
  transition: background-color 400ms ease;
  height: min-content;
`


function SemanticSearch({uploadId}) {
    const {isReady, fileType, answers, setAnswers} = useContext(ViewerContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchDisabled, setIsSearchDisabled] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)
    const [questionTagSelected, setQuestionTagSelected] = useState('q&a');
    const [textAreaPlaceholder, setTextAreaPlaceholder] = useState('Ask a Question ...');
    const updateSearches = (inputQuery, inputResults) => {
        if (!inputResults || !inputQuery) {
            return
        }
        let newValue = {
            query: inputQuery,
            answer: inputResults.answer,
            contexts: inputResults.contexts
        }
        setAnswers(oldArray => [newValue, ...oldArray])
    }

    const addAnswerToDb = async (result) => {
        try {
            await axios.post('/api/user/add_answer_to_db', result);
        } catch (err) {
            console.log('Error in background API call:', err);
        }
    };

    const searchAnswer = async () => {
        let params = {'key': uploadId, query: searchQuery, fileType: fileType, questionTagSelected}
        let result;
        setIsSearchDisabled(true)
        await axios.get('/api/user/get_search', {params: params}).then(res => {
            result = res.data
            setIsSearchDisabled(false)
            addAnswerToDb(result)
        }).catch(err => {
            console.log(err)
        })
        return result
    }

    const updateQuestionTag = (tag) => {
        setQuestionTagSelected(tag)
        if (tag === 'q&a') {
            setTextAreaPlaceholder('Ask a Question')
        } else if (tag === 'learn') {
            setTextAreaPlaceholder('What do you want to learn today')
        }
    }


    return (
        <Container>
            {searchLoading ? <LoadingSpinner><Spinner size="xl" color="blue.500"/></LoadingSpinner> :
                <SearchInputContainer>
                    <Textarea style={{borderColor: '#57657e'}} value={searchQuery}
                              noOfLines={1}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder={textAreaPlaceholder}
                    />
                    <SearchWithTags>
                        <SearchButton
                            isSearchDisabled={isSearchDisabled && !demoSearch.has(uploadId)}
                            onClick={async (e) => {
                                setSearchLoading(true);
                                updateSearches(searchQuery, await searchAnswer(e));
                                setSearchLoading(false)
                            }}>Search
                        </SearchButton>
                        <QuestionTypeTag onClick={() => updateQuestionTag('q&a')}
                                         isSelected={questionTagSelected === 'q&a'}>
                            Q & A
                        </QuestionTypeTag>
                        <QuestionTypeTag onClick={() => updateQuestionTag('learn')}
                                         isSelected={questionTagSelected === 'learn'}>
                            Learn
                        </QuestionTypeTag>
                    </SearchWithTags>

                </SearchInputContainer>}
            <PreviousSearches>

                {answers.map((elem, key) => {
                    return <AnswerBox key={key} question={elem.query} answer={elem.answer} contexts={elem.contexts}
                                      fileType={fileType}/>
                })}
            </PreviousSearches>

        </Container>
    );
}

export default SemanticSearch;