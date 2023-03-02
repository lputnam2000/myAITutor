import {createContext, createRef, useEffect, useRef, useState} from "react";
import { useRouter } from "next/router";

export const PDFViewerContext = createContext();

import React from 'react';

function PDFViewerContextProvider({ children }) {
    const router = useRouter()
    const [numPages, setNumPages] = useState(1);
    const [pdfKey, setPdfKey] = useState('');
    const [summary, setSummary] = useState([])
    useEffect(() => {
        if (!router.isReady) return;
            setPdfKey(router.query.uploadId)
    }, [router.isReady]);
    return (
        <PDFViewerContext.Provider value={{
            numPages,
            setNumPages,
            pdfKey,
            setPdfKey,
            summary,
            setSummary
        }}>
            {children}
        </PDFViewerContext.Provider>
    );
}

export default PDFViewerContextProvider;