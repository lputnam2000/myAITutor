import React from 'react';
import styled from 'styled-components'
import Link from 'next/link'

const Container = styled(Link)`
  width: 200px;
  height: 225px;
  border-radius: 10px;
  //padding: .5rem;
  transition: box-shadow ease-in-out .2s;
  cursor: pointer;
  //display: flex;
  //align-items: center;
  //justify-content: center;
  border: solid;
  border-width: 1px;
  overflow: hidden;
  &:hover {
    box-shadow: 5px 5px 0px #000000;
  }
`;
const ImageContainer = styled.div`
  width: 100%;
  height: 150px;
  overflow: hidden;
`

const Title = styled.div`
  font-family: mono;
  font-size: 1rem;
  max-height: 40px;
  white-space:nowrap;
  overflow: hidden;
  padding: auto;
  margin: auto;
  border: solid;
  border-width: 1px 0 0 0;

`


function PdfCard({title, uploadId, thumbnail}) {
    return (
        <Container href={`/summary/${uploadId}/`}>
            <ImageContainer>
              <img src={thumbnail}/>
            </ImageContainer>
            <Title>{title}</Title>
        </Container>
    );
}

export default PdfCard;