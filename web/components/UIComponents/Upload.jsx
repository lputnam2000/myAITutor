import React, {useRef, useState} from "react";
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
  color: ${theme.pink};
  font-weight: 400;
  font-size: 1.3rem;
`

const Container = styled.div`
  width: 150px;
  height: 225px;
  border: solid 3px;
  border-radius: 10px;
  padding: .5rem;
  background-color: ${theme.blue};
  transition: box-shadow ease-in-out .2s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    box-shadow: 5px 5px 0px #000000;
  }
`;

const PopButton = styled.button`
  width: 100%;
  height: 100%;
  border: solid;
  border-width: 3px;
  border-radius: 4px;
  padding: .5rem;
  background-color: ${theme.blue};
  color: black;
  transition: box-shadow ease-in-out .3s;
  font-weight: 500;

  &:hover {
    box-shadow: 5px 5px 0px #000000;
  }
`

export default function Upload({handleFile}) {

    const {isOpen, onOpen, onClose} = useDisclosure("");
    const hiddenFileInput = React.useRef(null);


    const handleFileButtonClick = () => {
        hiddenFileInput.current.click();
    };

    const handleFileChange = event => {
        const fileUploaded = event.target.files[0];
        handleFile(fileUploaded);
        onClose();
    };

    return (<>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent bg={theme.primary} sx={{'border': 'solid', 'border-width': '3px'}}>
                <ModalHeader color={theme.secondary}>Upload a PDF</ModalHeader>
                <ModalBody>
                    <PopButton bg={theme.secondary} onClick={handleFileButtonClick}>
                        Select PDF
                    </PopButton>
                    <input
                        type="file"
                        ref={hiddenFileInput}
                        onChange={handleFileChange}
                        style={{display: 'none'}}
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
            <Directions>Upload New PDF</Directions>
        </Container>
    </>);
}