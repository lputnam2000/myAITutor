import React, {useEffect, useState} from 'react';
import styled from 'styled-components'
import Link from 'next/link'
import {
    Button, IconButton, Menu, MenuButton, MenuItem, MenuList,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Input,
    FormControl,
    FormLabel,
} from "@chakra-ui/react";
import {HiDotsVertical} from 'react-icons/hi'
import {useRouter} from "next/router";
import {DeleteIcon, EditIcon} from "@chakra-ui/icons";
import axios from "axios";
import {AnimatePresence, motion,} from 'framer-motion';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 225px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid black;
  overflow: hidden;
  transition: box-shadow ease-in-out .1s;

  &:hover {
    box-shadow: 4px 4px 0px ${props => props.theme.colors.secondary};
    transform: translate(-1px, -1px)
  }

  background-color: ${props => props.theme.colors.primary};
`;
const ImageContainer = styled.div`
  width: 100%;
  height: 150px;
  overflow: hidden;
`

const CardInformation = styled.div`
  flex-grow: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 15px 10px;
  overflow: hidden;
  background-color: #fafdd4;
  border-top: solid 1px;

`

const CenteredText = styled.div`
  font-weight: 600;
  font-size: 14px;
  white-space: ${props => props.fileType === 'url' ? 'normal' : 'nowrap'};
  overflow: hidden;
  text-overflow: ${props => props.fileType === 'url' ? 'none' : 'ellipsis'};
`

const TagList = styled.div`
  background-color: #fafdd4;
  display: flex;
  justify-content: space-between;
`
const Tag = styled.div`
  margin: 10px;
  font-size: 13px;
  padding: 3px 8px;
  border-radius: 10px;
  background-color: #ef59e8;
  color: white;

`


const typeToLabel = {
    'pdf': 'PDF',
    'url': 'Website',
    'youtube': 'YouTube'
}

function PdfCard({title, uploadId, thumbnail, type, onRemove, onRename}) {
    // ...
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const openRenameModal = (e) => {
        e.stopPropagation();
        setIsRenameModalOpen(true);
    };

    const closeRenameModal = () => {
        setIsRenameModalOpen(false);
    };
    const renameUpload = (e) => {
        e.stopPropagation();
        console.log("New title:", newTitle);
        // Perform your API call or other logic to update the title
        onRename(uploadId, type, newTitle)
        closeRenameModal();
    };
    const removeUpload = (e) => {
        e.stopPropagation();

        // Hide the card with the animation
        setIsVisible(false);

        // Remove the card after the animation duration
        setTimeout(() => {
            onRemove(uploadId, type);
        }, exitAnimation.transition.duration * 1000);
    };
    // ...
    const router = useRouter()
    const [thumbnailUrl, setThumbnailUrl] = useState('')
    const [isVisible, setIsVisible] = useState(true);


    useEffect(() => {
        if (type === 'youtube') {
            const apiUrl = `https://noembed.com/embed?url=${encodeURIComponent(title)}`;
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    setThumbnailUrl(data.thumbnail_url);
                })
                .catch(error => console.error(error));
        }
    }, [type])

    const openSummary = () => {
        router.push(`/summary?uploadId=${uploadId}&fileType=${type}`)
        console.log('called')
    }
    const MotionContainer = motion(Container);

    const exitAnimation = {
        scale: 0,
        opacity: 0,
        transition: {
            duration: 0.3,
            ease: "easeInOut",
        },
    };


    return (<>
        {isVisible && (
            <AnimatePresence>
                <MotionContainer
                    onClick={openSummary}
                    exit={exitAnimation}
                >
                    {type === 'pdf' && <ImageContainer>
                        <img src={thumbnail} alt="" onError={(e) => {
                            e.target.style.display = "none"
                        }}/>
                    </ImageContainer>}
                    {type === 'youtube' && <ImageContainer>
                        <img src={thumbnailUrl} alt="" onError={(e) => {
                            e.target.style.display = "none"
                        }}/>
                    </ImageContainer>}
                    <CardInformation>
                        <CenteredText fileType={type}>{title}</CenteredText></CardInformation>
                    <TagList>
                        <Tag>{typeToLabel[type]}</Tag>
                        <Menu>
                            <MenuButton
                                as={IconButton}
                                aria-label='Options'
                                icon={<HiDotsVertical size={17}/>}
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                                variant='filled'
                            />
                            <MenuList>
                                <MenuItem icon={<EditIcon/>} onClick={openRenameModal}>
                                    Rename
                                </MenuItem>
                                <MenuItem onClick={removeUpload} icon={<DeleteIcon/>}>
                                    Remove
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </TagList>
                </MotionContainer>
            </AnimatePresence>
        )
        }
        <Modal isOpen={isRenameModalOpen} onClose={closeRenameModal}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Rename Title</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <FormControl>
                        <FormLabel>New Title</FormLabel>
                        <Input
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                        />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={renameUpload}>
                        Submit
                    </Button>
                    <Button onClick={closeRenameModal}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </>);
}

export default React.memo(PdfCard);