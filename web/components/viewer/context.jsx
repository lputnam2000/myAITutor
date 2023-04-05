import {createContext, useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";

export const ViewerContext = createContext();

import React from 'react';
import {WebsocketContext} from "../WebsocketContext";

function ViewerContextProvider({children}) {
    const router = useRouter()
    const [numPages, setNumPages] = useState(1);
    const [pdfKey, setPdfKey] = useState('');
    const [summary, setSummary] = useState([])
    const [title, setTitle] = useState('');
    const [fileType, setFileType] = useState('');
    const [isReady, setIsReady] = useState(false);
    const [isWebsiteReady, setIsWebsiteReady] = useState(false);
    const {socket} = useContext(WebsocketContext);
    const [liveSummary, setLiveSummary] = useState({
        isSummarizing: false,
        summaryJson: {formattedSummary: [], startPage: 0, endPage: 0}
    });

    useEffect(() => {
        if (!router.isReady) return;
        setPdfKey(router.query.uploadId)
        setFileType(router.query.fileType)
    }, [router.isReady, router.query]);

    useEffect(() => {
        if (!socket) return;
        if (pdfKey === '') return

        // Listen for specific messages
        const handleMessage = (data) => {
            let jsonData = JSON.parse(data)
            if (jsonData['key'] === 'isReady') {
                setIsReady(jsonData['value'])
            } else if (jsonData['key'] === 'isWebsiteReady') {
                setIsWebsiteReady(jsonData['value'])
            }
            console.log('Message received:', data);
        };

        const handleLiveSummary = (data) => {
            let jsonData = JSON.parse(data)
            if (!jsonData.isSummarizing && jsonData.summaryJson !== {}) {
                setSummary(summary => [jsonData.summaryJson, ...summary])
            }
            setLiveSummary(jsonData)

            console.log('Received data', data)
        }

        socket.on(pdfKey, handleMessage);
        socket.on(`${pdfKey}:summary`, handleLiveSummary);

        // Clean up the listener when the component is unmounted
        return () => {
            socket.off(pdfKey, handleMessage);
            socket.off(`${pdfKey}:summary`, handleLiveSummary);
        };
    }, [socket, pdfKey]);


    return (
        <ViewerContext.Provider value={{
            numPages,
            setNumPages,
            pdfKey,
            setPdfKey,
            summary,
            setSummary,
            title,
            setTitle,
            fileType,
            setFileType,
            isReady,
            setIsReady,
            isWebsiteReady,
            setIsWebsiteReady,
            liveSummary,
            setLiveSummary
        }}>
            {children}
        </ViewerContext.Provider>
    );
}

export default ViewerContextProvider;