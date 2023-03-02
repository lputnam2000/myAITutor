import React, {useEffect, useState} from 'react';
import styled from 'styled-components'
import {Input} from '@chakra-ui/react'
import axios from "axios";

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


function SemanticSearch({uploadId}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [answer, setAnswer] = useState('');
    const searchAnswer = () => {
        let params = {'key': uploadId, query: searchQuery}

        axios.get('/api/user/get_search', {params: params}).then(res => {
            setAnswer(res.data.answer)
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <Container>
            <SearchInputContainer>
                <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                       placeholder='Ask a Question'/>
                <SearchButton onClick={searchAnswer}>Search</SearchButton>
            </SearchInputContainer>
            <AnswerContainer>
                {answer && <div>Here is the answer : {answer}</div>}
            </AnswerContainer>
        </Container>
    );
}

export default SemanticSearch;