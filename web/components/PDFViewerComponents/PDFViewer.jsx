import React, {useContext, useEffect, useRef, useState} from 'react';
import {Document, Page} from "react-pdf";
import styled from "styled-components";
import {PDFViewerContext} from "@/components/PDFViewerComponents/context";

const StyledPage = styled(Page)`
  margin-bottom: 7px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;

`

const Container = styled.div`
  width: 30vw;
  //padding: 5px;
  //background-color: gray;
  margin-top: 10px;
  margin-left: 60px;
  border-color: black;
  align-items: center;
`

function PdfViewer({pdfFile}) {

    const {setNumPages, setPageNumber, numPages, getPagesMap} = useContext(PDFViewerContext)
    const containerRef = useRef()
    useEffect(() => {

    }, containerRef)

    const [width, setWidth] = useState(800);

    useEffect(() => {
        const handleWindowResize = () => {
            setWidth(window.innerWidth * .5);
        };

        window.addEventListener('resize', handleWindowResize);
        handleWindowResize()
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    });

    function onDocumentLoadSuccess({numPages}) {
        setNumPages(numPages);
        setPageNumber(1);
        // pagesRef.current = pagesRef.current.slice(0, numPages)
    }


    return (
        <Container>
            <Document
                file={pdfFile}
                onLoadSuccess={onDocumentLoadSuccess}
                title
            >
                {
                    Array.from({length: numPages}, (_, index) =>
                        <div key={index} ref={(node) => {
                            const map = getPagesMap();
                            if (node) {
                                map.set(index, node);
                            } else {
                                map.delete(index);
                            }
                        }}>
                            <StyledPage width={width} pageNumber={index + 1}
                                // ref={el => pagesRef.current(el)}
                            />
                        </div>
                    )
                }
            </Document>
        </Container>
    );
}

export default PdfViewer;