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
import {AnimatePresence, motion,} from 'framer-motion';
import Image from "next/image";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 225px;
  border-radius: 4px;
  cursor: pointer;
  padding: 5px;
  //border: 3px solid #515757;
  overflow: hidden;
  transition: box-shadow ease-in-out .1s;
  background-color: #242933;
  color: #3fd9b1;

  &:hover {
    box-shadow: 4px 4px 0px #48fdce;
  }
`;
const ImageContainer = styled.div`
  width: 100%;
  height: 150px;
  overflow: hidden;
  border-radius: 3px;
`

const CardInformation = styled.div`
  flex-grow: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 15px 10px;
  overflow: hidden;
`

const CenteredText = styled.div`
  font-weight: 600;
  font-size: 14px;
  white-space: ${props => props.fileType === 'url' ? 'normal' : 'nowrap'};
  overflow: hidden;
  text-overflow: ${props => props.fileType === 'url' ? 'none' : 'ellipsis'};
`

const TagList = styled.div`
  display: flex;
  justify-content: space-between;
`
const Tag = styled.div`
  margin: 10px;
  font-size: 13px;
  padding: 3px 8px;
  border-radius: 10px;
  background-color: #48fdce;
  color: #242933;
`


const typeToLabel = {
    'pdf': 'PDF',
    'url': 'Website',
    'youtube': 'YouTube',
    'mp4': 'Video'
}

function PdfCard({title, uploadId, thumbnail, type, onRemove, onRename, url = ''}) {
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
            const apiUrl = `https://noembed.com/embed?url=${encodeURIComponent(url)}`;
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    setThumbnailUrl(data.thumbnail_url);
                })
                .catch(error => console.error(error));
        }
    }, [type, url, uploadId])

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
                    {type === 'mp4' && <ImageContainer>
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
                            <MenuList borderColor={'#57657e'} bg='#1c2025'>
                                <MenuItem bg='#1c2025' icon={<EditIcon/>} onClick={openRenameModal}>
                                    Rename
                                </MenuItem>
                                <MenuItem bg='#1c2025' onClick={removeUpload} icon={<DeleteIcon/>}>
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
            <ModalContent backgroundColor='#242933'>
                <ModalHeader color={'#fff'}>Rename Title</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <FormControl>
                        <FormLabel color={'#fff'}>New Title</FormLabel>
                        <Input
                            borderColor={'#57657e'}
                            color={'#fff'}
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