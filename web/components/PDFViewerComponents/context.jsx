import {createContext, createRef, useEffect, useRef, useState} from "react";

export const PDFViewerContext = createContext();

import React from 'react';

function PDFViewerContextProvider({children}) {
    const [numPages, setNumPages] = useState(1);
    const [pageNumber, setPageNumber] = useState(1);

    const pagesRef = useRef(null);
    const getPagesMap = () => {
        if (!pagesRef.current) {
            pagesRef.current = new Map()
        }
        return pagesRef.current
    }

    const scrollToPage = (pageNumber) => {
        const map = getPagesMap();
        const node = map.get(pageNumber);
        if (node) {
            console.log(node)
            node.scrollIntoView({
                block: 'nearest',
                inline: 'center',
            });
        }
    }

    useEffect(() => {
        if (pageNumber >= 1 && pageNumber <= numPages) {
            scrollToPage(pageNumber - 1)
        }
    }, [pageNumber]);


    return (
        <PDFViewerContext.Provider value={{
            numPages,
            setNumPages,
            pageNumber,
            setPageNumber,
            pagesRef,
            getPagesMap
        }}>
            {children}
        </PDFViewerContext.Provider>
    );
}

export default PDFViewerContextProvider;