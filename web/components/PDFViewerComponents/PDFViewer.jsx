import React, {useContext} from 'react';
import {Document, Page} from "react-pdf";
import styled from "styled-components";
import {PDFViewerContext} from "@/components/PDFViewerComponents/context";

const StyledPage = styled(Page)`
  margin-bottom: 5px;
`

const Container = styled.div`
`

function PdfViewer({pdfFile}) {

    const {setNumPages, setPageNumber, numPages, getPagesMap} = useContext(PDFViewerContext)


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
                            <StyledPage width={600} pageNumber={index + 1}
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