import React, {useEffect} from "react";
import Link from "next/link";
import {useRouter} from 'next/router';
import {IconButton} from '@chakra-ui/react'
import styled from 'styled-components'

import {AiOutlineHome} from "react-icons/ai";


const Container = styled.div`
  background-color: #242933;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: #57657e 2px solid;
  height: 50px;
  @media (max-width: 600px) {
    height: 75px;
  }
  @media (max-width: 400px) {
    height: 60px;
  }
`

const Logo = styled(Link)`
  font-family: var(--font-b);
  font-weight: 700;
  font-size: 30px;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  padding-left: 30px;
  padding-right: 30px;
  @media (max-width: 400px) {
    padding-left: 0px;
    padding-right: 0px;
    font-size: 24px;
  }
`;


function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}



const HomeIconButton = styled(IconButton)`
  margin: 4px 10px 4px 10px;
`

const LoginButton = styled.button`
  margin-right: 10px;
  font-size: 18px;
  font-weight: 600;
  margin-left: 20px;
  padding: 5px;
  border-radius: 3px;
  background-color: #FFDB58;
  color: #1c2025;
  transition: box-shadow ease-in-out .1s;

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
`


function Navbar(props) {
    const router = useRouter()


    function goToHome() {
        router.push("/home")
    };

    return (
        <Container>
            <HomeIconButton aria-label='Go to Home' icon={<AiOutlineHome size={22} color='#fff'/>}
                            variant='outline'
                            borderColor='#57657e'
                            onClick={goToHome}

            />
            <Logo href={'/'}>
                chimpbase
            </Logo>
            <LoginButton onClick={goToHome}>Sign In! </LoginButton>
        </Container>
    );
}


export default Navbar;