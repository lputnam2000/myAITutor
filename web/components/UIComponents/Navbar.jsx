import React, {useEffect, useRef, useState} from "react";
import Link from "next/link";
import {useRouter} from 'next/router';
import {useSession, signIn, signOut} from "next-auth/react"
import {Badge, Flex, Avatar, Box, Text} from '@chakra-ui/react'
import styled from 'styled-components'

import {
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
} from '@chakra-ui/react'

function BadgePP({name, profilePic}) {
    const router = useRouter()


    return (<>
        <Menu>
            <MenuButton>
                <Flex bg='#FBFBFF' p='0.5rem' borderRadius='1.4rem'>
                    <Avatar src={profilePic}/>
                    <Box ml='3'>
                        <Text fontWeight='bold'>
                            {name}
                            <Badge ml='1' colorScheme='green'>
                                New
                            </Badge>
                        </Text>
                        <Text fontSize='sm' className="tw-font-main tw-text-gray-400 tw-text-right tw-pr-5">More
                            Options</Text>
                    </Box>
                </Flex>
            </MenuButton>
            <MenuList>
                <MenuItem onClick={() => {
                    signOut();
                    router.push("/api/auth/signout");
                }}>Log out</MenuItem>
            </MenuList>
        </Menu>
    </>)
}

/*<div className={`${styles["nosqueeze"]} ${styles["btn-hover"]} ${styles["color-1"]}`} onClick={signOutClick}>
      Sign out
    </div>*/

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

const Logo = styled(Link)`
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

const StyledLink = styled(Link)`
  height: 25px;
  font-size: 20px;
  margin-left: 10px;
  margin-right: 10px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    border-bottom: 2px black solid;
    transition: border-bottom 0.1s ease-in-out;
  }
`

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const ProfileContainer = styled.div`
  position: relative;
  display: inline-block;
`

const ProfileIcon = styled.div`
  margin-right: 10px;
  margin-left: 10px;
  width: 45px;
  height: 45px;
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

const SignOutMenu = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  width: 100px;
  height: 30px;
  background-color: ${props => props.theme.colors.primary};
  border: 2px solid #000000;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${props => (props.visible ? '1' : '0')};
  pointer-events: ${props => (props.visible ? 'auto' : 'none')};
  transition: opacity 0.3s ease;
`

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
  top: 45px;
  background-color: #f9f9f9;
  min-width: 160px;
  z-index: 1;
  border: 2px solid black;
  border-radius: 2px;
`;

const ProfileDropdown = styled.div`
  position: relative;
  display: inline-block;

  &:hover ${ProfileMenu} {
    display: block;
  }

  &:hover ${ProfileIcon} {
    border: ${(props) => props.theme.colors.secondary} 2px solid;
    transition: border 0.1s ease-in-out;
    transform: scale(1.2);
  }
`;


const IconContainer = styled.div`
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

    return (
        <Container>
            <Logo href={'/'}>
                chimpbase
            </Logo>
            <ButtonsContainer>
                <StyledLink href={'home'}>
                    Home
                </StyledLink>
                <ProfileDropdown>
                    <IconContainer>

                        <ProfileIcon color1={color1} color2={color2}
                        />
                    </IconContainer>
                    <ProfileMenu>
                        <SignOutOption onClick={signOutClick}>Sign Out</SignOutOption>
                    </ProfileMenu>
                </ProfileDropdown>
            </ButtonsContainer>
        </Container>
    );
}


export default Navbar;