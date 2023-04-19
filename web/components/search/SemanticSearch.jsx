import React, {useCallback, useContext, useState} from 'react';
import styled from 'styled-components'
import {Textarea} from '@chakra-ui/react'
import axios from "axios";
import AnswerBox from "./Answer"
import {Spinner} from "@chakra-ui/react";
import {ViewerContext} from "../viewer/context";
import {QandA, Explain} from "components/search/questions";
import {IoIosSend} from 'react-icons/io'

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
  color: #ffe135;
  padding: 4px 8px;
  margin: 2px 0px 2px 5px;
  border-radius: 4px;
  display: flex;
  align-items: center;

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
  color: #FFE135;;
  background-color: black;
  font-family: var(--font-b);
  font-weight: 700;
  letter-spacing: .3px;
  padding: 2px 15px;
  margin: 0px 10px 0px 0px;
  border-radius: 20px;
  transition: background-color 400ms ease;
  height: min-content;
`

const SendIcon = styled(IoIosSend)`
  font-size: 20px;
`

const tags = [
    ['q&a', 'Q & A'],
    ['learn', 'Explain'],
]


function SemanticSearch({uploadId}) {
    const {isReady, fileType, answers, setAnswers} = useContext(ViewerContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchDisabled, setIsSearchDisabled] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)
    const [questionTagSelected, setQuestionTagSelected] = useState('q&a');
    const [textAreaPlaceholder, setTextAreaPlaceholder] = useState('Ask a Question');
    const updateSearches = (inputResults) => {
        setAnswers(oldArray => [inputResults, ...oldArray])
    }

    const addAnswerToDb = useCallback(
        async (result) => {
            console.log('RESULTS ARE ', result)
            try {
                await axios.post('/api/user/add_answer_to_db', result);
            } catch (err) {
                console.log('Error in background API call:', err);
            }
        }, []);

    const searchAnswer = useCallback(
        async () => {
            let params = {'key': uploadId, query: searchQuery, fileType: fileType, questionTagSelected}
            let result;
            setIsSearchDisabled(true)
            await axios.get('/api/user/get_search', {params: params}).then(res => {
                result = res.data
                setIsSearchDisabled(false)
            }).catch(err => {
                console.log(err)
            })
            return result
        },
        [uploadId, searchQuery, fileType, questionTagSelected],
    );

    const updateQuestionTag = (tag) => {
        setQuestionTagSelected(tag)
        if (tag === 'q&a') {
            setTextAreaPlaceholder('Ask a Question')
        } else if (tag === 'learn') {
            setTextAreaPlaceholder('What do you want to learn today?')
        }
    }

    const onClickSearch = useCallback(
        async (e) => {
            setSearchLoading(true);
            let result = await searchAnswer(e)
            updateSearches(result);
            setSearchLoading(false)
            await addAnswerToDb(result)
        },
        [updateSearches, addAnswerToDb, searchAnswer],
    );


    return (
        <Container>
            {searchLoading ? <LoadingSpinner><Spinner size="xl" color="blue.500"/></LoadingSpinner> :
                <SearchInputContainer>
                    {
                        questionTagSelected === 'q&a' &&
                        <QandA searchQuery={searchQuery} setSearchQuery={setSearchQuery}>

                            <SearchButton
                                isSearchDisabled={isSearchDisabled && !demoSearch.has(uploadId)}
                                onClick={onClickSearch}>
                                <SendIcon/>
                                Ask!
                            </SearchButton>
                        </QandA>
                    }
                    {
                        questionTagSelected === 'learn' &&
                        <Explain searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
                            <SearchButton
                                isSearchDisabled={isSearchDisabled && !demoSearch.has(uploadId)}
                                onClick={onClickSearch}>
                                <SendIcon/>
                                Ask!
                            </SearchButton>
                        </Explain>
                    }
                    <SearchWithTags>

                        {tags.map((tag, idx) => {
                            if (tag[0] === questionTagSelected) {
                                return null;
                            }
                            return (
                                <QuestionTypeTag key={tag[0]} onClick={() => updateQuestionTag(tag[0])}>
                                    {tag[1]}
                                </QuestionTypeTag>
                            );
                        })}
                    </SearchWithTags>

                </SearchInputContainer>}
            <PreviousSearches>
                {answers.map((elem, key) => {
                    return <AnswerBox key={key} question={elem.query} answer={elem.answer} contexts={elem.contexts}
                                      fileType={fileType} answerElem={elem}/>
                })}
            </PreviousSearches>

        </Container>
    );
}

export default SemanticSearch;