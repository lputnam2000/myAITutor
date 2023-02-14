import React from 'react';
import styled from 'styled-components'

const Container = styled.div`
  height: 100px;
  background-color: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: ${(props) => props.theme.colors.secondary} 5px solid;
  @media (max-width: 600px) {
    height: 75px;
  }
`

const Logo = styled.div`
  font-family: var(--font-b);
  font-weight: 700;
  margin-left: 30px;
  font-size: 50px;
  color: ${props => props.theme.colors.secondary};
  cursor: pointer;
  padding-left: 30px;
  padding-right: 30px;
  @media (max-width: 600px) {
    font-size: 35px;
    margin-left: 0;
    padding-left: 15px;
  }
`;


const WaitlistContainer = styled.div`
  border-left: ${(props) => props.theme.colors.secondary} 5px solid;
  font-family: var(--font-open);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  height: 100%;
  color: ${props => props.theme.colors.primary};
  background-color: ${props => props.theme.colors.secondary};
  padding-left: 40px;
  padding-right: 40px;

  &:hover {
    color: ${props => props.theme.colors.secondary};
    background-color: ${props => props.theme.colors.blue};
  }

  @media (max-width: 600px) {
    font-size: 15px;
    padding-left: 20px;
    padding-right: 20px;
  }
  @media (max-width: 374px) {
    font-size: 10px;
    padding-left: 10px;
    padding-right: 10px;
  }
  cursor: pointer;
`

function HomeNavbar(props) {
    return (
        <Container>
            <Logo>
                chimpbase
            </Logo>
            <WaitlistContainer>
                Join the Waitlist
            </WaitlistContainer>
        </Container>
    );
}

export default HomeNavbar;