import React, {useRef, useState} from "react";
import styled from "styled-components"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    useDisclosure,
    Image,
    Button, FormControl, FormLabel, Input, FormHelperText, FormErrorMessage,
} from '@chakra-ui/react'
import {Select} from '@chakra-ui/react'
import axios from "axios";


const Directions = styled.div`
  color: ${props => props.theme.colors.secondary};
  font-weight: 500;
  font-size: 20px;
  width: 100%;
  text-align: center;
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
  transition: border-radius ease-in-out .25s;
  transition: background-color ease-in-out .25s;

  &:hover {
    border-radius: 20px;
    background-color: #fafdd4;
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

const StyledSelect = styled(Select)`
  margin-bottom: 20px;
`

const PreviewButton = styled(Button)`
  margin-top: 20px;
`

const WebsiteInput = ({url, setUrl}) => {
    const handleInputChange = (e) => setUrl(e.target.value)
    return (
        <FormControl>
            <FormLabel>Website URL</FormLabel>
            <Input type='email' value={url} onChange={handleInputChange}/>
            <FormHelperText>
                Please make sure the website you enter is publicly accessible.
            </FormHelperText>
        </FormControl>
    )
}

const YoutubeThumbnail = styled.div`
`
const YoutubeInput = ({url, setUrl}) => {
    const [thumbnailUrl, setThumbnailUrl] = useState('')
    const handleInputChange = (e) => {
        setUrl(e.target.value)
        const apiUrl = `https://noembed.com/embed?url=${encodeURIComponent(e.target.value)}`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                setThumbnailUrl(data.thumbnail_url);
            })
            .catch(error => console.error(error));
    }
    return (
        <FormControl>
            <FormLabel>YouTube Video URL</FormLabel>
            <Input type='email' value={url} onChange={handleInputChange}/>
            <FormHelperText>
                Please make sure that the YouTube video URL you enter is publicly accessible.
            </FormHelperText>
            <br/>
            <YoutubeThumbnail>
                {thumbnailUrl && <Image
                    src={thumbnailUrl}
                    alt='Thumbnail for Youtube Video'
                    borderRadius='lg'
                />}
            </YoutubeThumbnail>
        </FormControl>
    )
}

const sendS3 = async (file) => {
    if (!file) {
        console.log("no file was found")
        return
    }

    const requestObject = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "fileName": file.name,
            "fileType": file.type,
        })
    }

    let uploadID

    await fetch('/api/getUploadURL', requestObject)
        .then(res => res.json())
        .then(data => {
            uploadID = data["fileName"]
            fetch(data["signedUrl"], {
                headers: {'content-type': file.type},
                method: 'PUT',
                body: file,
            }).then((res) => {
                return res.text()
            }).then((txt) => {
                console.log(txt)
            })
        })
    return uploadID
}

const DropBox = styled.div`
  border: 1px dashed black;
  padding: 20px;
`

const DropText = styled.p`
  font-weight: 600;
  margin-bottom: 20px;
`

const FileInformation = styled.p`
  margin-top: 5px;
`


export default function Upload({handleFile}) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileType, setFileType] = useState('');
    const {isOpen, onOpen, onClose} = useDisclosure("");
    const hiddenFileInput = React.useRef(null);
    const [url, setUrl] = useState('');


    const closeModal = () => {
        setUrl('')
        setFileType('')
        setSelectedFile(null)
        onClose()
    }

    const handleSelectFileType = (e) => {
        setFileType(e.target.value)
    }

    const handleFileButtonClick = () => {
        hiddenFileInput.current.click();
    };

    const handleFileChange = event => {
        const fileUploaded = event.target.files[0];
        if (!fileUploaded) return;
        const fileExtension = fileUploaded.name.split('.').pop().toLowerCase();
        if (fileExtension !== 'pdf') {
            alert('Please select a PDF file.');
            return;
        }
        setSelectedFile(fileUploaded)
    };

    const handleFileDrop = event => {
        event.preventDefault();
        const fileUploaded = event.dataTransfer.files[0];
        const fileExtension = fileUploaded.name.split('.').pop().toLowerCase();
        if (fileExtension !== 'pdf') {
            alert('Please select a PDF file.');
            return;
        }
        setSelectedFile(fileUploaded)
    };

    const handleDragOver = event => {
        event.preventDefault();
    };

    const renderSelectedFile = () => {
        if (selectedFile) {
            return <FileInformation>Selected file: {selectedFile.name}</FileInformation>;
        } else {
            return
        }
    };

    const uploadDocument = async () => {
        if (fileType === 'url') {
            axios.post('/api/user/add_website_document', {url,}).then((res) => {
                const {key, fileName} = res.data
                handleFile(fileName, fileType, key);
                closeModal()
            }).catch((err) => {
                console.error(err)
            })
        } else if (fileType === 'youtube') {
            axios.post('/api/user/add_youtube_video', {url,}).then((res) => {
                const {key, fileName} = res.data
                handleFile(fileName, fileType, key);
                closeModal()
            }).catch((err) => {
                console.error(err)
            })
            console.log(url)
        } else if (fileType === 'pdf') {
            const uploadID = await sendS3(selectedFile);
            console.log(uploadID);
            handleFile(selectedFile, fileType, uploadID);
            closeModal();
        } else {
            closeModal()
        }

    }

    return (<>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent bg={'white'} sx={{'border': 'solid', 'borderWidth': '2px'}}>
                <ModalHeader color={'black'}>Upload To Summarize</ModalHeader>
                <ModalBody>
                    <StyledSelect value={fileType} onChange={handleSelectFileType}
                                  placeholder='Choose information type'>
                        <option value='pdf'>Document (PDF)</option>
                        <option value='url'>Website link</option>
                        <option value='youtube'>Youtube Video</option>
                    </StyledSelect>
                    {
                        fileType === 'pdf' && <>
                            <DropBox onDrop={handleFileDrop} onDragOver={handleDragOver}
                            > <DropText>Drag and drop a PDF file here or</DropText>

                                <PopButton bg={'white'} onClick={handleFileButtonClick}>
                                    Select PDF
                                </PopButton>
                                <input
                                    type="file"
                                    ref={hiddenFileInput}
                                    onChange={handleFileChange}
                                    accept="application/pdf"
                                    style={{display: 'none'}}
                                />
                            </DropBox>
                            {renderSelectedFile()}
                        </>
                    }
                    {
                        fileType === 'url' &&
                        <>
                            <WebsiteInput url={url} setUrl={setUrl}/>
                        </>
                    }
                    {
                        fileType === 'youtube' &&
                        <>
                            <YoutubeInput url={url} setUrl={setUrl}/>
                        </>
                    }
                </ModalBody>

                <ModalFooter>
                    <Button color={'black'} mr={3} onClick={uploadDocument}>
                        Submit
                    </Button>
                    <Button color={'black'} mr={3} onClick={closeModal}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

        <Container onClick={onOpen}>
            <Directions>Upload to summarize</Directions>
        </Container>
    </>);
}