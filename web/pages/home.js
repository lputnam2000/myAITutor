import Navbar from "../components/UIComponents/Navbar";
import React, {useEffect, useState} from "react";
import styled from 'styled-components'

import Upload from "../components/UIComponents/Upload";
import PDFCard from "../components/PDFCard";
import axios from "axios";

const sendS3 = (file) => {
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

    fetch('/api/getUploadURL', requestObject)
        .then(res => res.json())
        .then(data => {
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

}

const HomeContainer = styled.div`
  margin: 30px
`

const UserFilesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 150px);
  grid-auto-flow: dense;
  gap: 10px;
`

const HomeHeading = styled.h1`
  font-size: 30px;
  margin-bottom: 10px;

`

export default function Home() {
    const [userUploads, setUserUploads] = useState([]);

    useEffect(() => {
        axios.get('/api/user/uploads').then((res) => {
            setUserUploads(res.data['uploads'])
            console.log(res.data['uploads'])
        }).catch((err) => {
            console.log(err)
        })
    }, []);

    return (
        <>
            <Navbar/>
            <HomeContainer>
                <HomeHeading>
                    Your Summaries:
                </HomeHeading>
                <UserFilesContainer>
                    <Upload handleFile={sendS3}></Upload>
                    {
                        userUploads.map((upload) =>
                            <PDFCard key={upload.uuid} uploadId={upload.uuid} title={upload.title}/>
                        )
                    }
                </UserFilesContainer>
            </HomeContainer>

        </>
    );
}