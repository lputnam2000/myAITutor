import React, {useEffect, useState} from 'react';
import styled from 'styled-components'
import DemoPDFViewer from "./viewer/DemoPDFViewer";
import Summary from "./viewer/Summary";
import axios from "axios";
import DemoSummary from "./viewer/DemoSummary";

const Container = styled.div`
  width: 100%;
  //height: 70vh;
`

const InnerContainer = styled.div`
  display: flex;
  width: 100%;
  flex-grow: 1;
  @media (min-width: 900px) {
    flex-direction: row;
    align-items: stretch
  }
  flex-direction: column;
  align-items: stretch;
`

const PDFViewerContainer = styled.div`
  flex: 1;
  margin: 10px;
  margin-right: 20px;
`
const SelectDemoContainer = styled.div`
  margin-top: 20px;
  margin-left: 80px;
  margin-right: 80px;
  height: 50px;
  border-radius: 3px;
  display: flex;
  align-items: center;
`

const DemoOption = styled.div`
  font-size: 15px;

  background-color: #9de87f;
  border: 1px solid black;
  margin: 1px 5px 1px 5px;
  padding: 4px 5px 3px 5px;
  font-weight: 700;
  border-radius: 3px;
  cursor: pointer;

`

const SummaryContainer = styled.div`
  margin: 10px 10px 10px 10px;
  position: relative;
  @media (max-width: 899px) {
    height: 450px;
  }
  @media (min-width: 900px) {
    width: 40vw;
    margin: 10px 10px 10px 0px;
  }
`

function DemoPdfSummary(props) {
    const [demoKey, setDemoKey] = useState('b1bee4f2-c9e1-45da-acaa-b560c145ecca');
    const [pdfFile, setPdfFile] = useState('');
    const [summary, setSummary] = useState([]);
    const [title, setTitle] = useState('');

    useEffect(() => {
        let params = {'key': demoKey}
        axios.get('/api/user/get_demo_pdf', {params: params}).then(res => {
            setPdfFile(res.data.s3Url)
            setSummary(res.data.documentDetails.summary)
            setTitle(res.data.documentDetails.title)
        }).catch(err => {
            console.log(err)
        })
    }, [demoKey])

    return (
        <Container>
            {/*<SelectDemoContainer>*/}
            {/*    <DemoOption>Bill of Rights</DemoOption>*/}
            {/*    <DemoOption>World War 2</DemoOption>*/}
            {/*    <DemoOption>Podcast Summary</DemoOption>*/}
            {/*</SelectDemoContainer>*/}
            <InnerContainer>
                <PDFViewerContainer>
                    {pdfFile && <DemoPDFViewer pdfFile={pdfFile}/>}
                </PDFViewerContainer>
                <SummaryContainer>
                    <DemoSummary pdfKey={demoKey} summary={summary}/>
                </SummaryContainer>
            </InnerContainer>
        </Container>
    );
}

export default DemoPdfSummary;