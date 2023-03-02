import React, {useContext} from 'react';
import {Viewer, Worker} from "@react-pdf-viewer/core";
import {dropPlugin} from '@react-pdf-viewer/drop';
import '@react-pdf-viewer/drop/lib/styles/index.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import {toolbarPlugin} from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import styled from 'styled-components'
import readingIndicatorPlugin from "./ReadingIndicatorPlugin"
import {PDFViewerContext} from "./context";


const Container = styled.div`
  margin-left: 30px;
  margin-right: 30px;
  border: 2px black solid;
  height: 750px;
  width: 80%;
  padding-bottom: 32px;
  border-radius: 3px;

  &:hover {
    box-shadow: 5px 5px 0px #000000;
    transition: box-shadow 0.1s ease-in-out;
  }
`


function PdfViewer({pdfFile}) {
    const dropPluginInstance = dropPlugin();
    const toolbarPluginInstance = toolbarPlugin();
    const {renderDefaultToolbar, Toolbar} = toolbarPluginInstance;
    const readingIndicatorPluginInstance = readingIndicatorPlugin();
    const {ReadingIndicator} = readingIndicatorPluginInstance;


    const transform = (slot) => ({
        ...slot,
        // These slots will be empty
        Download: () => <></>,
        DownloadMenuItem: () => <></>,
        EnterFullScreen: () => <></>,
        SwitchTheme: () => <></>,
        Print: () => <></>,
        ShowProperties: () => <></>,
        ShowPropertiesMenuItem: () => <></>,
        Open: () => <></>,
        MoreActions: () => <></>,
    });

    const {setNumPages} = useContext(PDFViewerContext);

    const initializeContext = (info) => {
        setNumPages(info.doc._pdfInfo.numPages)
    }

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.3.122/build/pdf.worker.js">
            <Container>
                <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
                <Viewer fileUrl={pdfFile}
                        onDocumentLoad={initializeContext}
                        plugins={[toolbarPluginInstance, readingIndicatorPluginInstance]}/>
            </Container>
            <ReadingIndicator/>
        </Worker>
    );
}

export default PdfViewer;