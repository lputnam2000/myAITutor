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


const Directions = styled.div`
  color: ${props => props.theme.colors.secondary};
  font-weight: 500;
  font-size: 30px;
`

const Container = styled.div`
  width: 200px;
  height: 225px;
  border: solid 2px;
  border-radius: 4px;
  padding: .5rem;
  transition: box-shadow ease-in-out .2s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-radius ease-in-out .1s;

  &:hover {
    border-radius: 40px;
  }
`;

const PopButton = styled.button`
  width: 100%;
  height: 100%;
  border: solid 1px;
  border-radius: 4px;
  padding: .5rem;
  background-color: ${props => props.theme.colors.blue};
  transition: box-shadow ease-in-out .1s;
  font-weight: 500;

  &:hover {
    box-shadow: 3px 3px 0px #000000;
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
            <ModalContent bg={'white'} sx={{'border': 'solid', 'borderWidth': '2px'}}>
                <ModalHeader color={'black'}>Upload a PDF</ModalHeader>
                <ModalBody>
                    <PopButton bg={'white'} onClick={handleFileButtonClick}>
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
                    <Button color={'black'} mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

        <Container onClick={onOpen}>
            <Directions>Import Information</Directions>
        </Container>
    </>);
}