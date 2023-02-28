import React from 'react';
import styled from 'styled-components'
import Link from 'next/link'

const Container = styled(Link)`
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 225px;
  border-radius: 10px;
  //padding: .5rem;
  cursor: pointer;
  //display: flex;
  //align-items: center;
  //justify-content: center;
  border: none;
  border-width: 1px;
  overflow: hidden;
  box-shadow: 1px 1px 2px rgba(0,0,0,.5);
  transition: box-shadow ease-in-out .1s;
  &:hover {
    box-shadow: 1px 1px 2px rgba(0,0,0,.5), 5px 5px 0px #000000;
    transform: translate(-0.5px, -0.5px)
  }
  background-color: ${props => props.theme.colors.primary};
`;
const ImageContainer = styled.div`
  width: 100%;
  height: 150px;
  overflow: hidden;
`

const Title = styled.div`
  display:flex;
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  border: solid;
  border-width: 1px 0 0 0;
  flex-direction: column;
  justify-content: center;
`

const CenteredText = styled.div`
  margin: auto;
  text-align: center;
  padding: .5rem;
`


function PdfCard({title, uploadId, thumbnail}) {
    return (
        <Container href={`/summary/${uploadId}/`}>
            <ImageContainer>
              <img src={thumbnail}/>
            </ImageContainer>
            <Title><CenteredText>{title}</CenteredText></Title>
        </Container>
    );
}

export default PdfCard;