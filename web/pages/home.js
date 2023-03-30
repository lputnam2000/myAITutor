import React, {useEffect, useState} from "react";
import styled from 'styled-components'
import axios from "axios";
import Upload from "../components/UIComponents/Upload";
import PDFCard from "../components/PDFCard";
import Layout from "../Layouts/basicLayout"
import WebsocketContextProvider from "../components/WebsocketContext";

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
            <WebsocketContextProvider>
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
            </WebsocketContextProvider>
        </Container>
    );
}

Home.PageLayout = Layout;

export default Home;