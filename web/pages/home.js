import React, {useContext, useEffect, useMemo, useRef, useState} from "react";
import styled from 'styled-components'
import axios from "axios";
import Upload from "../components/UIComponents/Upload";
import PDFCard from "../components/PDFCard";
import Layout from "../Layouts/basicLayout"
import {WebsocketContext} from "../components/WebsocketContext";
import LargeLoadingSpinner from "../components/LargeLoadingSpinner";
import {AnimatePresence} from 'framer-motion';
import {NextSeo} from 'next-seo';

const HomeContainer = styled.div`
  padding: 30px;
`

const Container = styled.div`
  height: 100%;
`

const UserFilesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 200px);
  grid-auto-flow: dense;
  gap: 10px;
  justify-content: center;
`

const EmptyCard = styled.div`
  visibility: hidden;
  width: 200px;
  height: 225px;
`;

function Home() {
    const [userUploads, setUserUploads] = useState([]);
    const [userUploadsObject, setUserUploadsObject] = useState({});

    const [cardsPerRow, setCardsPerRow] = useState(8);
    const filesContainerRef = useRef(null);
    const {socket} = useContext(WebsocketContext)
    const [isFetchingUploads, setIsFetchingUploads] = useState(true);

    useEffect(() => {
        if (!socket) return;
        const handleNewUpload = (data) => {
            let jsonData = JSON.parse(data)
            if (jsonData.type === 'new_upload') {
                let uploadId = jsonData.value.uuid
                setUserUploads(userUploads => [uploadId, ...userUploads])
                setUserUploadsObject(curUploads => {
                    return {
                        ...curUploads,
                        [uploadId]: jsonData.value,
                    }
                })
            } else if (jsonData.type === 'progress') {
                let uploadId = jsonData.key
                setUserUploadsObject(curUploads => {
                    return {
                        ...curUploads,
                        [uploadId]: {
                            ...curUploads[uploadId],
                            'progress': jsonData.value,
                        },
                    }
                })
            }
        }

        socket.on('home', handleNewUpload);

        return () => {
            socket.off('home', handleNewUpload);
        };
    }, [socket]);

    useEffect(() => {
        const calculateCardsPerRow = () => {
            const cardWidth = 200;
            const gapWidth = 10;
            const containerWidth = filesContainerRef.current.clientWidth;

            return Math.floor((containerWidth + gapWidth) / (cardWidth + gapWidth)) - 1;
        };
        const handleResize = () => {
            if (filesContainerRef.current) {
                let numCards = calculateCardsPerRow()
                if (numCards <= 0 || numCards < userUploads.length) {
                    setCardsPerRow(0)
                } else {
                    setCardsPerRow(calculateCardsPerRow());
                }
            }
        };
        handleResize()
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [filesContainerRef, userUploads]);

    const renameTitle = (uploadId, type, newTitle) => {
        let params = {key: uploadId, fileType: type, newTitle: newTitle};
        axios
            .patch("/api/user/update_title", {}, {params: params})
            .then((res) => {
                setUserUploadsObject((prevState) => {
                    return {
                        ...prevState,
                        [uploadId]: {
                            ...prevState[uploadId],
                            title: newTitle
                        }
                    }
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const removeUpload = (uploadId, type) => {
        let params = {key: uploadId, fileType: type};
        axios
            .delete("/api/user/delete_upload", {params: params})
            .then((res) => {
                setUserUploads((userUploads) => {
                    return userUploads.filter((item) => item !== uploadId);
                });
                setUserUploadsObject((oldVal) => {
                    const newVal = Object.keys(oldVal).reduce((acc, key) => {
                        if (key !== uploadId) {
                            acc[key] = oldVal[key];
                        }
                        return acc;
                    }, {});
                    return newVal
                })
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        axios.get('/api/user/uploads').then((res) => {
            let uploadsObject = res.data['uploads'].reduce((acc, document) => {
                acc[document.uuid] = document;
                return acc;
            }, {});
            setUserUploads(res.data['uploads'].map(document => document.uuid))
            setUserUploadsObject(uploadsObject)
            setIsFetchingUploads(false)
        }).catch((err) => {
            console.log(err)
        })
    }, []);

    const handleFileUpload = (file, type, uploadID, url) => {
        let newValue = {}
        if (type === 'pdf' || type === 'mp4') {
            newValue = {uuid: uploadID, title: file.name, progress: 0, type: type}
        } else {
            newValue = {uuid: uploadID, title: file, progress: 0, type: type, url}
        }
        setUserUploadsObject(curUploads => {
            return {
                ...curUploads,
                [uploadID]: newValue
            }
        })
        setUserUploads(oldArray => [uploadID, ...oldArray])
    }
    const exitAnimation = {
        scale: 0,
        opacity: 0,
        transition: {
            duration: 0.2,
            ease: "easeInOut",
        },
    };

    const pdfCards = useMemo(() => {
        return userUploads.map((uploadId, i) => {
            let upload = userUploadsObject[uploadId];
            if (!upload) {
                return <></>
            }
            return (
                <PDFCard
                    key={upload.uuid}
                    uploadId={upload.uuid}
                    title={upload.title}
                    url={upload.url ? upload.url : ''}
                    thumbnail={upload.thumbnail}
                    type={upload.type}
                    progress={upload.progress}
                    onRename={renameTitle}
                    onRemove={removeUpload}
                    exit={exitAnimation}
                />
            );
        });
    }, [userUploads, userUploadsObject]);

    if (isFetchingUploads) {
        return <LargeLoadingSpinner/>
    }

    return (
        <Container>
            <NextSeo
                title="Home"
                description="Chimpbase Home - Chimpbase is a game-changing information discovery platform, leveraging advanced AI technologies such as semantic search and chatGPT to deliver accurate, efficient and comprehensive insights from various sources including videos, documents, and websites. With AI-powered summarization and intuitive interfaces, Chimpbase is the ultimate solution for users seeking to deepen their understanding and knowledge."
            />
            <HomeContainer>
                <UserFilesContainer ref={filesContainerRef}>
                    <Upload handleFile={handleFileUpload}></Upload>
                    <AnimatePresence>
                        {pdfCards}
                    </AnimatePresence>

                    {Array(cardsPerRow)
                        .fill(0)
                        .map((_, i) => <EmptyCard key={`empty-${i}`}/>)
                    }
                </UserFilesContainer>
            </HomeContainer>
        </Container>
    );
}

Home.PageLayout = Layout;

export default Home;