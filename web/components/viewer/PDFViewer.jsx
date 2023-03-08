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


const Container = styled.div`
  border: 2px black solid;
  height: 500px;
  background-color: whitesmoke;
  border-radius: 3px;
  margin-left: 8px;
  margin-right: 8px;
  padding-bottom: 32px;

  @media (min-width: 750px) {
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
  }

`


function PdfViewer() {
    const dropPluginInstance = dropPlugin();
    const toolbarPluginInstance = toolbarPlugin();
    const {renderDefaultToolbar, Toolbar} = toolbarPluginInstance;
    const readingIndicatorPluginInstance = readingIndicatorPlugin();
    const {ReadingIndicator} = readingIndicatorPluginInstance;
    const [pdfFile, setPdfFile] = useState('');
    const {pdfKey, setSummary, setTitle, setFileType} = useContext(ViewerContext);

    const getDocumentDetails = (pdfKey) => {
        let params = {'key': pdfKey}
        axios.get('/api/user/get_pdf', {params: params}).then(res => {
            setSummary(res.data.documentDetails.summary)
        }).catch(err => {
            console.log(err)
        })
    }
    useEffect(() => {
        if (!pdfKey) return

        let params = {'key': pdfKey}
        axios.get('/api/user/get_pdf', {params: params}).then(res => {
            setPdfFile(res.data.s3Url)
            setSummary(res.data.documentDetails.summary)
            setTitle(res.data.documentDetails.title)
            setFileType(res.data.documentDetails.type)
        }).catch(err => {
            console.log(err)
        })
        let timer = setInterval(() => getDocumentDetails(pdfKey), 3000);
        return () => {
            timer = null
        }
    }, [pdfKey])


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

    const {setNumPages} = useContext(ViewerContext);

    const initializeContext = (info) => {
        setNumPages(info.doc._pdfInfo.numPages)
    }

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.3.122/build/pdf.worker.js">
            (<Container>
            <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
            {pdfFile &&
                <Viewer fileUrl={pdfFile}
                        onDocumentLoad={initializeContext}
                        plugins={[toolbarPluginInstance, readingIndicatorPluginInstance]}/>
            }
        </Container>
            <ReadingIndicator/>
        </Worker>
    );
}

export default PdfViewer;