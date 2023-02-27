import Navbar from "../components/UIComponents/Navbar";
import React, {useEffect, useState} from "react";
import styled from 'styled-components'
import axios from "axios";
import Upload from "../components/UIComponents/Upload";
import PDFCard from "../components/PDFCard";
import AWS from 'aws-sdk'
import { useRouter } from "next/router";

const S3_BUCKET = 'chimppdfstore';
const REGION = 'us-east-1';
const URL_EXPIRATION_TIME = 60; // in seconds
AWS.config.update({signatureVersion: 'v4'})
const myBucket = new AWS.S3({
    accessKeyId: '',
    secretAccessKey: '',
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

    await fetch('/api/getUploadURL', requestObject)
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
  grid-template-columns: repeat(auto-fit, 200px);
  grid-auto-flow: dense;
  gap: 10px;
`

const HomeHeading = styled.h1`
  font-size: 30px;
  margin-bottom: 10px;

`

export default function Home() {
    const [userUploads, setUserUploads] = useState([]);
    const router = useRouter();

    useEffect(() => {
        axios.get('/api/user/uploads').then((res) => {
            setUserUploads(res.data['uploads'])
        }).catch((err) => {
            console.log(err)
        })
    }, []);

    return (
        <>
            <Navbar/>
            <HomeContainer>
                <HomeHeading>
                    Your Library:
                </HomeHeading>
                <UserFilesContainer>
                    <Upload handleFile={(file)=>{sendS3(file).then(()=>setTimeout(() => router.reload("/home"), 5000))}}></Upload>
                    {
                        userUploads.map((upload) => {
                                return(<PDFCard key={upload.uuid} uploadId={upload.uuid} title={upload.title} thumbnail={upload.thumbnail}/>);
                            }
                        )
                    }
                </UserFilesContainer>
            </HomeContainer>

        </>
    );
}