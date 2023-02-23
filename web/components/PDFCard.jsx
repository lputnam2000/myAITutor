import React from 'react';
import styled from 'styled-components'
import Link from 'next/link'

const Container = styled(Link)`
  width: 150px;
  height: 225px;
  border-radius: 10px;
  //padding: .5rem;
  background-color: ${props => props.theme.colors.pink};
  transition: box-shadow ease-in-out .2s;
  cursor: pointer;
  //display: flex;
  //align-items: center;
  //justify-content: center;
  color: white;

  &:hover {
    box-shadow: 5px 5px 0px #000000;
  }
`;
const ImageContainer = styled.div`
  background-color: red;
  width: 150px;
  height: 125px;
`


function PdfCard({title, uploadId}) {
    return (
        <Container href={`/summary/${uploadId}/`}>{title}
            <ImageContainer>
                s
            </ImageContainer></Container>
    );
}

export default PdfCard;