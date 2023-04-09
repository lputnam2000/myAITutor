import {createContext, useCallback, useContext, useEffect, useState} from "react";
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
    const [isWebsiteReady, setIsWebsiteReady] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressMessage, setProgressMessage] = useState('');

    const {socket} = useContext(WebsocketContext);
    const [liveSummary, setLiveSummary] = useState({});
    const [goToContextYoutube, setGoToContextYoutube] = useState(() => (time) => {
    });
    const [goToContextVideo, setGoToContextVideo] = useState(() => (time) => {
    });

    const goToContext = useCallback(
        (context) => {
            if (fileType === 'mp4') {
                goToContextVideo(context.start_time)
            } else if (fileType === 'youtube') {
                goToContextYoutube(context.start_time)
            }
        },
        [goToContextVideo, goToContextYoutube, fileType],
    );


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
            if (jsonData['key'] === 'isWebsiteReady') {
                setIsWebsiteReady(jsonData['value'])
            }
            console.log('Message received:', data);
        };

        const handleLiveSummary = (data) => {
            let jsonData = JSON.parse(data)
            if (jsonData.isSummarizing) {
                setLiveSummary(jsonData.summary)
            } else {
                setLiveSummary({})
                setSummary(prevState => [jsonData.summary, ...prevState])
            }
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
            progress,
            setProgress,
            progressMessage,
            setProgressMessage,
            isWebsiteReady,
            setIsWebsiteReady,
            liveSummary,
            setLiveSummary,
            goToContext,
            setGoToContextYoutube,
            setGoToContextVideo
        }}>
            {children}
        </ViewerContext.Provider>
    );
}

export default ViewerContextProvider;