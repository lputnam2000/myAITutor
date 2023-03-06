import React, {useEffect, useState} from "react";
import styled, {keyframes} from 'styled-components'
import axios from "axios";
import Upload from "../components/UIComponents/Upload";
import PDFCard from "../components/PDFCard";
import AWS from 'aws-sdk'
import {useRouter} from "next/router";
import Layout from "../Layouts/basicLayout"

const S3_BUCKET = 'chimppdfstore';
const REGION = 'us-east-1';
const URL_EXPIRATION_TIME = 60; // in seconds
AWS.config.update({signatureVersion: 'v4'})
const myBucket = new AWS.S3({
    accessKeyId: 'AKIA6NDMNPBRA4VZTMO6',
    secretAccessKey: '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',
    params: {Bucket: S3_BUCKET},
    region: REGION,
})

function generatePreSignedPutUrl(fileName, fileType) {
    let result = myBucket.getSignedUrlPromise('putObject', {
        Key: fileName,
        ContentType: fileType,
        Expires: URL_EXPIRATION_TIME,
    }).then((url) => {
        console.log('url', url)
        return url
    })
    return result
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
  background: linear-gradient(-45deg, #85d4ef, #8ff6de, #ef9c82, #f59ec0);
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
    const router = useRouter();

    useEffect(() => {
        axios.get('/api/user/uploads').then((res) => {
            setUserUploads(res.data['uploads'])
        }).catch((err) => {
            console.log(err)
        })
    }, []);
    useEffect(() => {
    }, [userUploads])

    return (
        <Container>
            <HomeContainer>
                <UserFilesContainer>
                    <Upload handleFile={(file, type) => {
                        sendS3(file).then((uploadID) => {
                            let newValue = {uuid: uploadID, title: file.name, status: 'Not Ready', type: type}
                            setUserUploads(oldArray => [...oldArray, newValue])
                        })
                    }}></Upload>
                    {
                        userUploads.map((upload) => {
                                return (<PDFCard key={upload.uuid} uploadId={upload.uuid} title={upload.title}
                                                 thumbnail={upload.thumbnail} type={upload.type}/>);
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