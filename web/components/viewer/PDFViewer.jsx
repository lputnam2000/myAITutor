import React, {useContext, useEffect, useState} from 'react';
import {Viewer, Worker} from "@react-pdf-viewer/core";
import {dropPlugin} from '@react-pdf-viewer/drop';
import '@react-pdf-viewer/drop/lib/styles/index.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import {toolbarPlugin} from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import styled from 'styled-components'
import readingIndicatorPlugin from "./ReadingIndicatorPlugin"
import {ViewerContext} from "./context";
import axios from "axios";
import {defaultLayoutPlugin} from "@react-pdf-viewer/default-layout";


const Container = styled.div`
  border: 2px black solid;
  background-color: #292929;
  border-radius: 3px;
  position: relative;

  height: 500px;
  @media (max-width: 550px) {
    padding: 10px;
    height: 350px;
  }
  @media (min-width: 900px) {
    border: 2px solid #57657e;
    height: 100%;
    transition: box-shadow 0.1s ease-in-out;
    &:hover {
      box-shadow: 5px 5px 0px #48fdce;
    }
  }
`

const ViewerWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
`

function PdfViewer() {
    const toolbarPluginInstance = toolbarPlugin();
    const {renderDefaultToolbar, Toolbar} = toolbarPluginInstance;
    const readingIndicatorPluginInstance = readingIndicatorPlugin();
    const {ReadingIndicator} = readingIndicatorPluginInstance;
    const [pdfFile, setPdfFile] = useState('');
    const {pdfKey, setSummary, setTitle, setFileType, setIsReady} = useContext(ViewerContext);

    useEffect(() => {
        if (!pdfKey) return

        let params = {'key': pdfKey}
        axios.get('/api/user/get_pdf', {params: params}).then(res => {
            setPdfFile(res.data.s3Url)
            setSummary(res.data.documentDetails.summary)
            setTitle(res.data.documentDetails.title)
            setFileType(res.data.documentDetails.type)
            setIsReady(res.data.documentDetails.status === 'Ready')
        }).catch(err => {
            console.log(err)
        })

    }, [pdfKey])


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

    const {setNumPages} = useContext(ViewerContext);

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
                <ViewerWrapper>
                    {pdfFile &&
                        <Viewer theme='dark' fileUrl={pdfFile}
                                onDocumentLoad={initializeContext}
                                plugins={[defaultLayoutPluginInstance, readingIndicatorPluginInstance]}/>
                    }
                </ViewerWrapper>
            </Container>
            <ReadingIndicator/>
        </Worker>
    );
}

export default PdfViewer;