import Navbar from "../components/UIComponents/Navbar";
import React, { useRef, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Text } from '@chakra-ui/react'
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons'
import styles from '/styles/home.module.scss'

import Upload from "../components/UIComponents/Upload";

const sendS3 = (file) => {
    if (!file) {
        console.log("no file was found")
        return
    }

    const requestObject = {
        method:'POST' ,
        headers: {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            "fileName":  file.name,
            "fileType": file.type,
        })
    }

    fetch('/api/getUploadURL',requestObject)
        .then(res => res.json())
        .then(data => {
            fetch(data["signedUrl"] , {
                headers: {'content-type': file.type},
                method:'PUT',
                body:file,
            }).then((res) => {
                return res.text()
            }).then((txt) => {console.log(txt)})
    })

}

export default function home() {
    return (
        <>
            <Navbar />
            <div className="tw-min-w-full tw-font-mono tw-bg-cbpink tw-py-5">
                <div className={`tw-w-2/3 tw-min-h-screen tw-mx-auto`}>
                    <div className={`tw-w-full tw-h-screen tw-grid tw-grid-cols-3 tw-grid-rows-3`}>
                        <div className={`tw-col-start-2 tw-row-start-2 tw-col-span-1 tw-row-span-1 tw-h-full tw-mx-1`}>
                            <Upload handleFile={sendS3}></Upload>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}