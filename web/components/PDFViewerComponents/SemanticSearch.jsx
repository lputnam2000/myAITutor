import React, {useEffect, useState} from 'react';
import styled from 'styled-components'
import {Input} from '@chakra-ui/react'
import axios from "axios";
import AnswerBox from "./Answer"
import { Spinner } from "@chakra-ui/react";

const Container = styled.div`
  height: 100%;
`
const SearchInputContainer = styled.div`
  margin-bottom: 5px;
`
const SearchButton = styled.button`
  background-color: ${({isSearchDisabled, theme}) => isSearchDisabled ? 'gray': theme.colors.secondary};
  cursor: ${({isSearchDisabled, theme}) => isSearchDisabled ? 'not-allowed': 'pointer'};
  color: white;
  padding: 5px;
  margin-top: 10px;
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

function SemanticSearch({uploadId}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [answers, setAnswers] = useState([]);
    const [isSearchDisabled, setIsSearchDisabled] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)
    const updateSearches = (inputQuery, inputResults) => {
      if (!inputResults || !inputQuery) {
        return
      }
      let newValue = {
        query: inputQuery,
        answer: inputResults.answer,
        contexts: inputResults.contexts
      }
      setAnswers(oldArray => [...oldArray, newValue])
    }

    const searchAnswer = async () => {
        let params = {'key': uploadId, query: searchQuery}
        let result;
        setIsSearchDisabled(true)
        await axios.get('/api/user/get_search', {params: params}).then(res => {
            result = res.data
            setIsSearchDisabled(false)
        }).catch(err => {
            console.log(err)
        })
        return result
    }

    return (
        <Container>
            {searchLoading ? <LoadingSpinner><Spinner size="xl" color="blue.500"/></LoadingSpinner> : <SearchInputContainer>
                <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                       placeholder='Ask a Question'/>
                <SearchButton isSearchDisabled={isSearchDisabled} onClick={async (e) => {setSearchLoading(true);updateSearches(searchQuery, await searchAnswer(e)); setSearchLoading(false)}}>Search</SearchButton>
            </SearchInputContainer>}
            <PreviousSearches>
            {answers.map((elem, key)=>{
              return <AnswerBox key={key} question={elem.query} answer={elem.answer} contexts={elem.contexts}/>
            })}
            </PreviousSearches>
            
        </Container>
    );
}

export default SemanticSearch;