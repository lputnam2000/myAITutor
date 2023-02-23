import React, {useContext, useState} from 'react';
import styled from 'styled-components'
import {SmallAddIcon} from "@chakra-ui/icons";
import {Input, InputGroup, InputLeftAddon, InputRightAddon} from "@chakra-ui/react";
import {PDFViewerContext} from "./context";
import axios from "axios";

const Container = styled.div`
  position: relative
`

const NewSummaryButton = styled.button`
  margin-top: 5px;
  margin-left: 5px;
  padding: 5px 10px;
  font-weight: 500;
  display: flex;
  gap: 15px;
  border-radius: 3px;
  transition: box-shadow .1s ease-in-out;
  border: 2px solid black;

  &:hover {
    box-shadow: 5px 5px 0px black;
  }

  align-items: center;
  background-color: ${props => props.theme.colors.pink};
  color: white;
`

const OptionsBox = styled.div`
  position: absolute;
  background-color: white;
  color: black;
  z-index: 1;
  height: 140px;
  width: 260px;
  bottom: -140px;
  left: 5px;
  border: 2px solid black;
  border-radius: 4px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: start;
`

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
`

function PageInput({heading, end, value, setValue, error}) {

    return (
        <InputContainer>
            {heading}:
            <InputGroup size='sm' width={'50%'}>
                <Input isInvalid={error} value={value} onChange={(e) => setValue(e.target.value)}
                       type={"number"}/>
                <InputRightAddon>
                    /&nbsp;{end}
                </InputRightAddon>
            </InputGroup>
        </InputContainer>
    )
}

const Button = styled.button`
  cursor: pointer;
  border: 1px solid black;
  padding: 5px 20px;
  border-radius: 4px;
  background-color: ${(props) => props.theme.colors.blue};
  color: black;
`


function GenerateSummary(props) {
    const [showOption, setShowOption] = useState(false);
    const [startPage, setStartPage] = useState(1);
    const [startError, setStartError] = useState(false);
    const [endError, setEndError] = useState(false)
    const [endPage, setEndPage] = useState(1);
    const {numPages, pdfKey} = useContext(PDFViewerContext)

    const closeOptionsBox = (e) => {
        setShowOption(false)
    }

    const generateNewSummary = () => {
        if (startPage < 1 || startPage > numPages) {
            setStartError(true)
            return
        } else {
            setStartError(false)
        }
        if (endPage < 1 || endPage > numPages) {
            setEndError(true)
            return;
        } else {
            setEndError(false)
        }
        if (startPage > endPage) {
            setStartError(true)
            setEndError(true)
            return;
        } else {
            setEndError(false)
            setStartError(false)
        }
        // summarize document
        axios.post('/api/user/generate_summary', {
            pdfKey, startPage, endPage
        }).then((res) => {
            console.log(res)
        })
    }


    return (
        <Container>
            <NewSummaryButton onClick={() => setShowOption(true)}>
                Generate New Summary <SmallAddIcon boxSize={6}/>
            </NewSummaryButton>
            {
                showOption ? <OptionsBox>
                        <PageInput heading={"Start Page"} error={startError} end={numPages} value={startPage}
                                   setValue={setStartPage}/>
                        <PageInput heading={"End Page"} error={endError} end={numPages} value={endPage}
                                   setValue={setEndPage}/>
                        <span style={{display: "flex", gap: '10px', marginTop: '10px'}}>
                    <Button onClick={generateNewSummary}>Generate</Button>
                    <Button onClick={closeOptionsBox}>Close</Button>
                    </span>
                    </OptionsBox>
                    : <></>
            }
        </Container>
    );
}

export default GenerateSummary;