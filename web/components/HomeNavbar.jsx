import React from 'react';
import styled from 'styled-components'

const Container = styled.div`
  height: 150px;
  background-color: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: ${(props) => props.theme.colors.secondary} 5px solid;
  
`

const Logo = styled.div`
  font-family: var(--font-b);
  font-weight: 700;
  margin-left: 30px;
  font-size: 60px;
  color: ${props => props.theme.colors.secondary};
  cursor: pointer;
  padding-left: 30px;
  padding-right: 30px;
`;



const WaitlistContainer = styled.div`
  border-left: ${(props) => props.theme.colors.secondary} 5px solid;
  font-family: var(--font-open);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: bold;
  height: 100%;
  color: ${props => props.theme.colors.primary};
  background-color: ${props => props.theme.colors.secondary};
  padding-left: 40px;
  padding-right: 40px;
  &:hover{
    color: ${props => props.theme.colors.secondary};
    background-color: ${props => props.theme.colors.blue};
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