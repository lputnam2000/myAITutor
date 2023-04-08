import React from "react";
import styled from 'styled-components'

const Container = styled.div`
  background-color: #242933;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  justify-content: center;
  border-bottom: #57657e 2px solid;
  height: 50px;
  @media (max-width: 600px) {
    height: 75px;
  }
  @media (max-width: 400px) {
    height: 60px;
  }
`;

const Logo = styled.a`
  display: flex-column;
  align-items: center;
  font-family: var(--font-b);
  font-weight: 700;
  font-size: 30px;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  margin-left: 0;
  margin-right: 0;
  @media (max-width: 400px) {
    font-size: 24px;
  }
`;


const LoginButton = styled.a`
  margin-right: 10px;
  font-size: 18px;
  font-weight: 600;
  margin-left: auto;
  padding: 5px;
  border-radius: 3px;
  background-color: #FFE135;
  color: #3C2F23;
  transition: box-shadow ease-in-out .1s;
  width: fit-content;

  &:hover {
    box-shadow: 4px 4px 0px #776c43;
  }

  &:active {
    box-shadow: none;
  }

  display: flex;
  align-items: center;
  gap: 5px;
  @media (max-width: 900px) {
    font-size: 16px;
  }
  @media (max-width: 550px) {
    font-size: 14px;
  }
`;

const BetaText = styled.div`
  display: inline-block;
  background-color: #570f95;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  translate: 0 2px;
  color: brown;

  span {
    background-image: radial-gradient(circle at center, #d397de, #c862d3);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;
const LogoFlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: .5em;
`

function Navbar(props) {

    return (
        <Container>
            <div>
            </div>
            <LogoFlexRow><Logo
                href={'https://www.chimpbase.com/'}>chimpbase</Logo><BetaText><span>Beta</span></BetaText></LogoFlexRow>
            <LoginButton href={'https://www.chimpbase.com/home'}>Join Now!&#x1F412;</LoginButton>
        </Container>
    );
}

export default Navbar;
