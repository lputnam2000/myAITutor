import React from 'react';
import styled from 'styled-components'
import WebsiteViewer from "./WebsiteViewer";

const WebsiteContainer = styled.div`
  width: 100%;
`
const Container = styled.div`
`
const SummaryContainer = styled.div`
  background-color: yellow;
`

function WebsiteViewerWithSummary(props) {
    const url = 'https://en.wikipedia.org/wiki/FIFA'
    return (
        <Container>
            <WebsiteContainer>
                <WebsiteViewer url={url}/>
            </WebsiteContainer>
            <SummaryContainer>

            </SummaryContainer>
            {/*// <Summary/>*/}
        </Container>
    );
}

export default WebsiteViewerWithSummary;