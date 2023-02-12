import React, { useRef, useState } from "react";
import styled from "styled-components"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
} from '@chakra-ui/react'

const theme = {
    primary: '#FBFBFF',
    secondary: '#000000',
    green: '#39ff14',
    blue: '#1FDDFF',
    pink: '#FF1f8f'
}

const DottedRound = styled.div`
    width: 100%;
    border: none;
    height: 100%;
    border-radius: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: ${theme.primary};
`;

const Directions = styled.div`
    margin: 0 auto 0 auto;
    color: ${theme.pink};
`

const Container = styled.div`
    width: 100%;
    height: 100%;
    border: solid;
    border-width: 5px;
    border-radius: 2rem;
    padding: .5rem;
    background-color: ${theme.blue};
    transition: transform ease .5s, box-shadow ease .5s;
    &:hover {
        transform: translate(-0.125rem, -0.125rem);
        box-shadow: .125rem .125rem 0px rgba(0,0,0,1);
    }
    &:hover ${Directions} {
        color: ${theme.blue};
      }
      &:hover ${DottedRound} {
        background-color: ${theme.pink};
    }
`;

const PopButton = styled.button`
    width: 100%;
    height: 100%;
    border: solid;
    border-width: 5px;
    border-radius: 2rem;
    padding: .5rem;
    background-color: ${theme.blue};
    transition: transform ease .5s, box-shadow ease .5s;
    &:hover {
        transform: translate(-0.125rem, -0.125rem);
        box-shadow: .125rem .125rem 0px rgba(0,0,0,1);
    }
`

export default function Upload({ handleFile }) {

    const { isOpen, onOpen, onClose } = useDisclosure("");
    const hiddenFileInput = React.useRef(null);



    const handleFileButtonClick = () => {
        hiddenFileInput.current.click();
    };

    const handleFileChange = event => {
        const fileUploaded = event.target.files[0];
        handleFile(fileUploaded);
    };

    return (<>

        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bg={theme.primary} sx={{'border':'solid', 'border-width':'5px'}}>
                <ModalHeader color={theme.secondary}>Upload a PDF</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <PopButton bg={theme.secondary} onClick={handleFileButtonClick}>
                        <span style={{ color: theme.primary }}>Upload a file</span>
                    </PopButton>
                    <input
                        type="file"
                        ref={hiddenFileInput}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                </ModalBody>

                <ModalFooter>
                    <Button color={theme.secondary} mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

        <Container onClick={onOpen}>
            <DottedRound>
                <Directions>Upload New PDF</Directions>
            </DottedRound>
        </Container>
    </>);
}