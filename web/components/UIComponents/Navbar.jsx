import React, {useEffect, useRef, useState} from "react";
import Link from "next/link";
import {useRouter} from 'next/router';
import {useSession, signIn, signOut} from "next-auth/react"
import {Badge, Flex, Avatar, Box, Text, IconButton} from '@chakra-ui/react'
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
import {AiOutlineHome} from "react-icons/ai";

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
  height: 50px;
  background-color: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: ${(props) => props.theme.colors.secondary} 2px solid;
  @media (max-width: 600px) {
    height: 75px;
  }
`

const Logo = styled(Link)`
  font-family: var(--font-b);
  font-weight: 700;
  margin-left: 30px;
  font-size: 30px;
  color: ${props => props.theme.colors.secondary};
  cursor: pointer;
  padding-left: 30px;
  padding-right: 30px;
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
    const [username, setUsername] = useState('');

    useEffect(() => {
        if (session) {
            setUsername(session.user.name);
        }
    }, [session]);

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

    return (
        <Container>
            <HomeIconButton aria-label='Go to Home' icon={<AiOutlineHome size={22}/>}
                            variant='outline'
                            onClick={goToHome}/>
            <Logo href={'/'}>
                chimpbase
            </Logo>
            <ButtonsContainer>
                {/*<StyledLink href={'home'}>*/}
                {/*    Home*/}
                {/*</StyledLink>*/}
                <ProfileDropdown>
                    <IconContainer>

                        <ProfileIcon color1={color1} color2={color2}
                        />
                    </IconContainer>
                    <ProfileMenu>
                        <SignOutOption>{username}</SignOutOption>
                        <SignOutOption onClick={signOutClick}>Sign Out</SignOutOption>
                    </ProfileMenu>
                </ProfileDropdown>
            </ButtonsContainer>
        </Container>
    );
}


export default Navbar;