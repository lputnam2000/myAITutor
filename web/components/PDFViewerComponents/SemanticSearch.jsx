import React, {useEffect, useState} from 'react';
import styled from 'styled-components'
import {Input} from '@chakra-ui/react'
import axios from "axios";
import AnswerBox from "./Answer"

const Container = styled.div`
  height: 100%;
`
const SearchInputContainer = styled.div`
  margin-bottom: 5px;
`
const SearchButton = styled.button`
  background-color: black;
  color: white;
  cursor: pointer;
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

function SemanticSearch({uploadId}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [answers, setAnswers] = useState([]);

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
        let result
        await axios.get('/api/user/get_search', {params: params}).then(res => {
            result = res.data
        }).catch(err => {
            console.log(err)
        })
        return result
    }

    return (
        <Container>
            <SearchInputContainer>
                <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                       placeholder='Ask a Question'/>
                <SearchButton onClick={async (e) => {updateSearches(searchQuery, await searchAnswer(e))}}>Search</SearchButton>
            </SearchInputContainer>
            <PreviousSearches>
            {answers.map((elem, key)=>{
              return <AnswerBox key={key} question={elem.query} answer={elem.answer} contexts={elem.contexts}/>
            })}
            </PreviousSearches>
            
        </Container>
    );
}

export default SemanticSearch;