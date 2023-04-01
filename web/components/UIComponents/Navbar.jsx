import React, {useEffect, useState} from "react";
import Link from "next/link";
import {useRouter} from 'next/router';
import {useSession, signOut} from "next-auth/react"
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
  margin-left: 30px;
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

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const ProfileIcon = styled.div`
  margin-right: 10px;
  margin-left: 10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(to bottom right, ${props => props.color1}, ${props => props.color2});
  cursor: pointer;


  display: flex;
  justify-content: flex-end;
  align-items: center;
  transition: transform 0.3s ease;
  position: relative;
`

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const SignOutOption = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 5px 10px;

  &:hover {
    text-decoration: underline;
  }
`

const ProfileMenu = styled.div`
  display: none;
  position: absolute;
  right: 0;
  top: 40px;
  background-color: #4a5568;
  min-width: 160px;
  z-index: 1;
  border: 2px solid #1c2025;
  border-radius: 2px;
`;

const ProfileDropdown = styled.div`
  position: relative;
  display: inline-block;
  padding-left: 30px;
  color: white;

  &:hover ${ProfileMenu} {
    display: block;
  }

  &:hover ${ProfileIcon} {
    border: ${(props) => props.theme.colors.secondary} 2px #57657e;
    transition: border 0.1s ease-in-out;
  }
`;


const IconContainer = styled.div`
`

const HomeIconButton = styled(IconButton)`
  margin: 4px 10px 4px 10px;
`


function Navbar(props) {
    const {data: session} = useSession()
    const [color1, setColor1] = useState('');
    const [color2, setColor2] = useState('');

    useEffect(() => {
        setColor1(getRandomColor())
        setColor2(getRandomColor())
    }, []);
    const router = useRouter()

    function signOutClick() {
        signOut();
        router.push("/")
    };

    function goToHome() {
        router.push("/home")
    };

    function goToSettings() {
        router.push("/settings")
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
            <ButtonsContainer>
                <ProfileDropdown>
                    <IconContainer>

                        <ProfileIcon color1={color1} color2={color2}
                        />
                    </IconContainer>
                    <ProfileMenu>
                        <SignOutOption onClick={goToSettings}>Settings</SignOutOption>
                        <SignOutOption onClick={signOutClick}>Sign Out</SignOutOption>
                    </ProfileMenu>
                </ProfileDropdown>
            </ButtonsContainer>
        </Container>
    );
}


export default Navbar;