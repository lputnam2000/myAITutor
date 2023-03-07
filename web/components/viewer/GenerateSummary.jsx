import React, {useContext, useState} from 'react';
import styled from 'styled-components'
import {SmallAddIcon} from "@chakra-ui/icons";
import {Input, InputGroup, InputLeftAddon, InputRightAddon} from "@chakra-ui/react";
import {ViewerContext} from "./context";
import axios from "axios";
import {
    Spinner,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from '@chakra-ui/react';


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

const StyledButton = styled.button`
  cursor: pointer;
  border: 1px solid black;
  padding: 5px 20px;
  border-radius: 4px;
  background-color: ${(props) => props.theme.colors.blue};
  color: black;
`


const LoadingSpinner = styled.div`
  padding: 3px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`


function GenerateSummary(props) {
    const [showOption, setShowOption] = useState(false);
    const [startPage, setStartPage] = useState(1);
    const [startError, setStartError] = useState(false);
    const [endError, setEndError] = useState(false)
    const [endPage, setEndPage] = useState(1);
    const {numPages, pdfKey} = useContext(ViewerContext)
    const [summaryLoading, setSummaryLoading] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure();

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
        setShowOption(false)
        setSummaryLoading(true)
        setTimeout(() => { setSummaryLoading(false) }, 10000)
        axios.post('/api/user/generate_summary', {
            pdfKey, startPage, endPage
        }).then((res) => {
            console.log(res)
        })
    }

    const generateSummaryButton = () => {
        if (fileType === 'pdf') {
            setShowOption(true)
        } else {
            setSummaryLoading(true)
            setTimeout(() => {
                setSummaryLoading(false)
            }, 10000)
            axios.post('/api/user/generate_summary_web', {
                key: pdfKey
            }).then((res) => {
                console.log(res)
            })
        }
    }

    const contents = <><NewSummaryButton onClick={generateSummaryButton}>
        Generate New Summary <SmallAddIcon boxSize={6}/>
    </NewSummaryButton>
        {
            showOption ? <OptionsBox>
                <PageInput heading={"Start Page"} error={startError} end={numPages} value={startPage}
                    setValue={setStartPage} />
                <PageInput heading={"End Page"} error={endError} end={numPages} value={endPage}
                    setValue={setEndPage} />
                <span style={{ display: "flex", gap: '10px', marginTop: '10px' }}>
                    <StyledButton onClick={async () => {generateNewSummary(); onOpen()}}>Generate</StyledButton>
                    <StyledButton onClick={closeOptionsBox}>Close</StyledButton>
                </span>
            </OptionsBox>
                : <></>
        }
    </>

    const loadingNotice = <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Your Summary</ModalHeader>
            <ModalBody>
            Thank you for submitting your request. Your summary will be available as soon as it's ready. It may take a few minutes to generate, especially for longer documents. You'll see a loading symbol while we work on it, and it should disappear after about 10 seconds. Please note that even after the loading symbol disappears, your summary may still be processing in the background. We appreciate your patience and will display your summary as soon as it's ready            </ModalBody>
            <ModalFooter>
                <Button onClick={onClose}>Close</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>

    return (
        <Container>
            {summaryLoading ? <LoadingSpinner><Spinner size="xl" color="blue.500" /></LoadingSpinner> : contents}
            {loadingNotice}
        </Container>
    );
}

export default GenerateSummary;