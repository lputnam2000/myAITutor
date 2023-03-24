import React, {useEffect, useState} from "react";
import styled, {keyframes} from 'styled-components'
import axios from "axios";
import Upload from "../components/UIComponents/Upload";
import PDFCard from "../components/PDFCard";
import {useRouter} from "next/router";
import Layout from "../Layouts/basicLayout"
import {AnimatePresence} from "framer-motion";


const gradientKeyframes = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

const HomeContainer = styled.div`
  margin: 0 30px 30px 30px;
  padding: 30px;
`

const Container = styled.div`
  //background: linear-gradient(-45deg, #85d4ef, #8ff6de, #ef9c82, #f59ec0);
  background-size: 400% 400%;
  animation: ${gradientKeyframes} 300s ease infinite;
  min-height: 100vh;
`


const UserFilesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 200px);
  grid-auto-flow: dense;
  gap: 10px;
`

const HomeHeading = styled.h1`
  font-size: 30px;
  margin-bottom: 10px;
  cursor: default;

`

function Home() {
    const [userUploads, setUserUploads] = useState([]);

    const renameTitle = (uploadId, type, newTitle) => {
        let params = {key: uploadId, fileType: type, newTitle: newTitle};
        console.log(params)
        axios
            .patch("/api/user/update_title", {}, {params: params})
            .then((res) => {
                setUserUploads((userUploads) => {
                    return userUploads.map((item) => {
                        if (item.uuid === uploadId) {
                            return {
                                ...item,
                                title: newTitle // Replace newTitle with the variable containing the new title value
                            };
                        }
                        return item;
                    });
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
                    return userUploads.filter((item) => item.uuid !== uploadId);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        axios.get('/api/user/uploads').then((res) => {
            setUserUploads(res.data['uploads'])
        }).catch((err) => {
            console.log(err)
        })
    }, []);
    useEffect(() => {
    }, [userUploads])

    const handleFileUpload = (file, type, uploadID) => {
        if (type === 'pdf') {
            let newValue = {uuid: uploadID, title: file.name, status: 'Not Ready', type: type}
            setUserUploads(oldArray => [...oldArray, newValue])
        } else {
            let newValue = {uuid: uploadID, title: file, status: 'Not Ready', type: type}
            setUserUploads(oldArray => [...oldArray, newValue])
        }
    }


    return (
        <Container>
            <HomeContainer>
                <UserFilesContainer>
                    <Upload handleFile={handleFileUpload}></Upload>
                    {
                        userUploads.map((upload, i) => {
                                return (
                                    <PDFCard key={`${upload.uuid}-${i}`} uploadId={upload.uuid}
                                             title={upload.title}
                                             thumbnail={upload.thumbnail} type={upload.type} onRename={renameTitle}
                                             onRemove={removeUpload}
                                    />);
                            }
                        )
                    }
                </UserFilesContainer>
            </HomeContainer>

        </Container>
    );
}

Home.PageLayout = Layout;

export default Home;