import {createContext, createRef, useContext, useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";

export const ViewerContext = createContext();

import React from 'react';
import {WebsocketContext} from "../WebsocketContext";
import io from "socket.io-client";

function ViewerContextProvider({children}) {
    const router = useRouter()
    const [numPages, setNumPages] = useState(1);
    const [pdfKey, setPdfKey] = useState('');
    const [summary, setSummary] = useState([])
    const [title, setTitle] = useState('');
    const [fileType, setFileType] = useState('');
    const [isReady, setIsReady] = useState(true);

    const {socket} = useContext(WebsocketContext);

    useEffect(() => {
        if (!router.isReady) return;
        setPdfKey(router.query.uploadId)
        setFileType(router.query.fileType)
    }, [router.isReady]);

    useEffect(() => {
        if (!socket) return;
        if (pdfKey === '') return

        // Listen for specific messages
        const handleMessage = (data) => {
            if (data === 'Ready') {
                setIsReady(true)
            }
            console.log('Message received:', data);
        };

        socket.on(`${pdfKey}`, handleMessage);

        // Clean up the listener when the component is unmounted
        return () => {
            socket.off(`${pdfKey}`, handleMessage);
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
            setIsReady
        }}>
            {children}
        </ViewerContext.Provider>
    );
}

export default ViewerContextProvider;