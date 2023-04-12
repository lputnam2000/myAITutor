import React, {useState, useEffect} from 'react';
import styled from 'styled-components'
import {FcIdea} from 'react-icons/fc'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    FormControl,
    FormLabel,
    Textarea,
    VStack,
    HStack,
    Icon,
} from "@chakra-ui/react";
import {FaSadTear, FaFrown, FaMeh, FaSmile, FaGrinBeam} from "react-icons/fa";
import axios from "axios";


const Container = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  background-color: #f72b6c;
  color: #fff;
  padding: 10px;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  transition: all 0.3s ease-in-out;
  border-radius: 10px;
  gap: 5px;
  @media (max-width: 500px) {
    padding: 0;
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
`;

const GlowIcon = styled(FcIdea)`
  font-size: 40px;
  color: #fff;
  transition: all 0.3s ease-in-out;

  ${Container}:hover & {
    filter: drop-shadow(0px 0px 5px #f72b6c) drop-shadow(0px 0px 10px #f72b6c) drop-shadow(0px 0px 15px #f72b6c);
  }

  @media (max-width: 500px) {
    font-size: 30px;
  }
  margin-right: 5px;
`;

const HelperText = styled.span`
  margin-left: 10px;
  font-size: 16px;
  font-weight: 400;
  @media (max-width: 500px) {
    display: none;
  }
`;


function FeedbackOverlay(props) {
    const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
    const [suggestion, setSuggestion] = useState("");
    const [rating, setRating] = useState(0);
    const [showOverlay, setShowOverlay] = useState(null);

    useEffect(() => {
        const shouldShowOverlay = localStorage.getItem('showOverlay');
        if (shouldShowOverlay === 'false') {
            setShowOverlay(false);
        } else {
            setShowOverlay(true)
        }
    }, []);

    const handleHideOverlay = (e) => {
        e.stopPropagation();
        localStorage.setItem('showOverlay', false);
        setShowOverlay(false);
    };

    const closeSuggestionModal = () => {
        setRating(0)
        setSuggestion('')
        setIsSuggestionModalOpen(false);
    };

    const submitSuggestion = () => {
        if (suggestion !== '' || rating !== 0) {
            let data = {rating, suggestion};
            axios
                .post("/api/user/add_suggestion", data)
                .then((res) => {
                    setRating(0)
                    setSuggestion('')
                })
                .catch((err) => {
                    console.log(err);
                });
            console.log(suggestion, rating)
        }
        setIsSuggestionModalOpen(false);
        // Handle the submission of the suggestion and rating
    };
    return (
        <>
            {showOverlay !== null && showOverlay && (
                <Container onClick={(e) => setIsSuggestionModalOpen(true)}>
                    <HelperText>Have suggestions?</HelperText>
                    <GlowIcon/>
                    <button
                        style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#fff',
                            fontSize: '16px',
                            cursor: 'pointer',
                        }}
                        onClick={handleHideOverlay}
                    >
                        x
                    </button>
                </Container>
            )}

            <Modal isOpen={isSuggestionModalOpen} onClose={closeSuggestionModal}>
                <ModalOverlay/>
                <ModalContent backgroundColor="#242933">
                    <ModalHeader color={"#fff"}>Submit a Suggestion</ModalHeader>
                    <ModalCloseButton color={'#fff'}/>
                    <ModalBody>
                        <FormControl>
                            <FormLabel color={"#fff"}>Suggestion</FormLabel>
                            <Textarea
                                borderColor={"#57657e"}
                                color={"#fff"}
                                value={suggestion}
                                onChange={(e) => setSuggestion(e.target.value)}
                            />
                        </FormControl>
                        <VStack mt={4} alignItems="flex-start">
                            <FormLabel color={"#fff"}>Rate your experience:</FormLabel>
                            <HStack spacing={2}>
                                <Icon cursor={'pointer'} color={rating === 1 ? '#08f600' : '#fff'} as={FaSadTear}
                                      boxSize={6}
                                      onClick={() => setRating(1)}/>
                                <Icon cursor={'pointer'} color={rating === 2 ? '#08f600' : '#fff'} as={FaFrown}
                                      boxSize={6} onClick={() => setRating(2)}/>
                                <Icon cursor={'pointer'} color={rating === 3 ? '#08f600' : '#fff'} as={FaMeh}
                                      boxSize={6} onClick={() => setRating(3)}/>
                                <Icon cursor={'pointer'} color={rating === 4 ? '#08f600' : '#fff'} as={FaSmile}
                                      boxSize={6} onClick={() => setRating(4)}/>
                                <Icon cursor={'pointer'} color={rating === 5 ? '#08f600' : '#fff'} as={FaGrinBeam}
                                      boxSize={6} onClick={() => setRating(5)}/>
                            </HStack>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={submitSuggestion}>
                            Submit
                        </Button>
                        <Button colorScheme="red" onClick={closeSuggestionModal}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default FeedbackOverlay;