import React from 'react';
import styled from 'styled-components'
import {FcIdea} from 'react-icons/fc'


const Container = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  background-color: #f72b6c;
  color: #fff;
  padding: 10px;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  transition: all 0.3s ease-in-out;
  border-radius: 10px;
  gap: 5px;
  @media (max-width: 500px) {
    padding: 0;
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
`;

const GlowIcon = styled(FcIdea)`
  font-size: 40px;
  color: #fff;
  transition: all 0.3s ease-in-out;

  ${Container}:hover & {
    filter: drop-shadow(0px 0px 5px #f72b6c) drop-shadow(0px 0px 10px #f72b6c) drop-shadow(0px 0px 15px #f72b6c);
  }

  @media (max-width: 500px) {
    font-size: 30px;
  }
`;

const HelperText = styled.span`
  margin-left: 10px;
  font-size: 16px;
  font-weight: 400;
  @media (max-width: 500px) {
    display: none;
  }
`;

function FeedbackOverlay(props) {
    return (
        <Container>
            <HelperText>Have suggestions?</HelperText>
            <GlowIcon/>
        </Container>
    );
}

export default FeedbackOverlay;