import Navbar from "../components/UIComponents/Navbar";
import React, { useRef, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Text } from '@chakra-ui/react'
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons'
import styles from '/styles/home.module.scss'
import Upload from "../components/UIComponents/Upload";
import styled from 'styled-components'

const StyledUpload = styled.div`
    grid-column-start: 2;
    grid-column-end: 6;
    @media (min-width: 700px) {
        grid-column-start: 3;
        grid-column-end: 5;
        padding: 10px;
    }
`

const StyledH1 = styled.div`
    display:block;
    grid-column-start: 1;
    grid-column-end: 7;
    width: 100%;
    height: 100%;
    font-family: 'Josefin Sans', sans-serif;
    font-size: 3rem;
    text-align: center;
    color: #FBFBFF;
    @media (max-width: 700px) {
        font-size: 2rem;
    }
`

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
                headers: { 'content-type': file.type },
                method: 'PUT',
                body: file,
            }).then((res) => {
                return res.text()
            }).then((txt) => { console.log(txt) })
        })

}

export default function home() {
    return (
        <>
            <Navbar />
            <div className="tw-min-w-full tw-font-mono tw-bg-cbblue tw-py-5">
                <div className={`lg:tw-w-2/3 sm:tw-w-full tw-min-h-screen tw-mx-auto`}>
                    <div className={`tw-w-full tw-h-screen tw-grid tw-grid-cols-6 tw-grid-rows-6`}>
                            <StyledH1>Upload a PDF to get started!</StyledH1>
                            <StyledUpload>
                                <Upload handleFile={sendS3}></Upload>
                            </StyledUpload>
                    </div>
                </div>
            </div>
        </>
    );
}