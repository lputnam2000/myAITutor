import React, {useEffect} from "react";
import Link from "next/link";
import {useRouter} from 'next/router';
import {IconButton} from '@chakra-ui/react'
import styled from 'styled-components'

import {AiOutlineHome} from "react-icons/ai";


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

const Logo = styled(Link)`
  display: block;
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

const HomeIconButton = styled(IconButton)`
  margin: 4px 10px 4px 10px;
  width: fit-content;

`;

const LoginButton = styled.button`
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

function Navbar(props) {
  const router = useRouter();

  function goToHome() {
    router.push("/home");
  }

  return (
    <Container>
      <HomeIconButton
        aria-label="Go to Home"
        icon={<AiOutlineHome size={22} color="#fff" />}
        variant="outline"
        borderColor="#57657e"
        onClick={goToHome}
      />
      <Logo href={"/"}>chimpbase</Logo>
      <LoginButton onClick={goToHome}>Join Now!&#x1F412;</LoginButton>
    </Container>
  );
}

export default Navbar;
