import {createContext, createRef, useEffect, useRef, useState} from "react";

export const PDFViewerContext = createContext();

import React from 'react';

function PDFViewerContextProvider({children}) {
    const [numPages, setNumPages] = useState(1);
    const [pdfKey, setPdfKey] = useState('');
    const [summary, setSummary] = useState([])

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