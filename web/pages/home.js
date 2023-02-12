import Navbar from "../components/UIComponents/Navbar";
import React, { useRef, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Text } from '@chakra-ui/react'
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons'
import styles from '/styles/home.module.scss'

import Upload from "../components/UIComponents/Upload";

const sendS3 = (file) => {

    const requestObject = {
        method:'POST' ,
        headers: {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            "fileName": "name1",
            "fileType": "application/pdf"
        })
    }

    fetch('/api/getUploadURL',requestObject)
        .then(res => res.json())
        .then(data => {
            fetch(data["signedUrl"] , {
                headers: {'content-type': 'application/pdf'},
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
            <div className="tw-min-w-full tw-font-mono tw-bg-cbblack">
                <div className={`tw-w-2/3 tw-min-h-screen tw-mx-auto tw-bg-cbwhite`}>
                    <div className={`tw-w-full tw-h-screen tw-grid tw-grid-cols-3 tw-grid-rows-3`}>
                        <div className={`tw-row-start-1 tw-col-start-1 tw-col-span-3`}>
                            <div className="tw-flex tw-flex-row tw-h-fit">
                                <div className={`tw-flex tw-flex-col tw-justify-center ${styles.leftIcon}`}>
                                    <ArrowLeftIcon boxSize={20} w={20}/>
                                </div>
                                <div className={`tw-flex tw-flex-row tw-overflow-x-scroll ${styles.noScrollbar}`}>
                                    <div className="tw-w-fit tw-h-fit tw-flex tw-flex-row tw-space-x-1.5">
                                        <Card w='10rem' h='10rem'>
                                            <CardBody>
                                                <Text>Description of project recently worked on</Text>
                                            </CardBody>
                                        </Card>
                                        <Card w='10rem' h='10rem'>
                                            <CardBody>
                                                <Text>Description of project recently worked on</Text>
                                            </CardBody>
                                        </Card>
                                        <Card w='10rem' h='10rem'>
                                            <CardBody>
                                                <Text>Description of project recently worked on</Text>
                                            </CardBody>
                                        </Card>
                                        <Card w='10rem' h='10rem'>
                                            <CardBody>
                                                <Text>Description of project recently worked on</Text>
                                            </CardBody>
                                        </Card>
                                        <Card w='10rem' h='10rem'>
                                            <CardBody>
                                                <Text>Description of project recently worked on</Text>
                                            </CardBody>
                                        </Card>
                                        <Card w='10rem' h='10rem'>
                                            <CardBody>
                                                <Text>Description of project recently worked on</Text>
                                            </CardBody>
                                        </Card>
                                        <Card w='10rem' h='10rem'>
                                            <CardBody>
                                                <Text>Description of project recently worked on</Text>
                                            </CardBody>
                                        </Card>
                                        <Card w='10rem' h='10rem'>
                                            <CardBody>
                                                <Text>Description of project recently worked on</Text>
                                            </CardBody>
                                        </Card>
                                        <Card w='10rem' h='10rem'>
                                            <CardBody>
                                                <Text>Description of project recently worked on</Text>
                                            </CardBody>
                                        </Card>
                                        <Card w='10rem' h='10rem'>
                                            <CardBody>
                                                <Text>Description of project recently worked on</Text>
                                            </CardBody>
                                        </Card>
                                        <Card w='10rem' h='10rem'>
                                            <CardBody>
                                                <Text>Description of project recently worked on</Text>
                                            </CardBody>
                                        </Card>
                                    </div>
                                </div>
                                <div className={`tw-flex tw-flex-col tw-justify-center ${styles.rightIcon}`}>
                                    <ArrowRightIcon boxSize={20} w={20}/>
                                </div>
                            </div>
                        </div>
                        
                        <div className={`tw-col-start-2 tw-col-span-2 tw-row-start-2 tw-row-span-2 tw-h-full tw-w-full tw-grid tw-grid-cols-3 tw-grid-rows-3 tw-grid-flow-row tw-place-content-evenly tw-gap-3`}>
                            <div className={`tw-col-start-2 tw-col-span-1 tw-row-span-2 tw-h-full`}>
                                <Upload handleFile={sendS3}></Upload>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}