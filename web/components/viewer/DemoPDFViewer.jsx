import React, {useState} from 'react';
import {Viewer, Worker} from "@react-pdf-viewer/core";
import '@react-pdf-viewer/drop/lib/styles/index.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import {toolbarPlugin} from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import styled from 'styled-components'
import readingIndicatorPlugin from "./ReadingIndicatorPlugin"
import {defaultLayoutPlugin} from "@react-pdf-viewer/default-layout";


const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  background-color: #292929;
  border-radius: 3px;
  padding-bottom: 32px;
  border: 1px black solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 450px;
  @media (min-width: 750px) {
    height: 750px;
    padding-bottom: 32px;
    border-radius: 3px;
    margin: 17px;
    &:hover {
      box-shadow: 5px 5px 0px #000000;
      transition: box-shadow 0.1s ease-in-out;
    }
  }
  margin-left: 0px;
  margin-right: 0px;
  padding-right: 2px;

`


function DemoPdfViewer({pdfFile}) {
    const toolbarPluginInstance = toolbarPlugin();
    const {renderDefaultToolbar} = toolbarPluginInstance;
    const readingIndicatorPluginInstance = readingIndicatorPlugin();
    const {ReadingIndicator} = readingIndicatorPluginInstance;
    const [numPages, setNumPages] = useState(0);

    const transformToolbar = (slot) => ({
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

    // const {setNumPages} = useContext(PDFViewerContext);

    const initializeContext = (info) => {
        setNumPages(info.doc._pdfInfo.numPages)
    }

    const renderCustomToolbar = (
        Toolbar
    ) => <Toolbar>{renderDefaultToolbar(transformToolbar)}</Toolbar>;

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        sidebarTabs: (defaultTabs) => [
            defaultTabs[0], // Thumbnails tab
        ],
        renderToolbar: renderCustomToolbar,
    })

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.3.122/build/pdf.worker.js">
            <Container>
                <Viewer theme='dark' fileUrl={pdfFile}
                        onDocumentLoad={initializeContext}
                        plugins={[defaultLayoutPluginInstance, readingIndicatorPluginInstance]}/>
            </Container>
            <ReadingIndicator/>
        </Worker>
    );
}

export default DemoPdfViewer;