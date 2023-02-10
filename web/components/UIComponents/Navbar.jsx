import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/router';
import styles from '/styles/components/UIComponents/navbar.module.scss'
import { useSession, signIn, signOut } from "next-auth/react"
import { Badge, Flex, Avatar, Box, Text } from '@chakra-ui/react'
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

function BadgePP({ name, profilePic }) {
  const router = useRouter()
  

  return (<>
    <Menu>
      <MenuButton>
        <Flex bg='#FBFBFF' p='0.5rem' borderRadius='1.4rem'>
          <Avatar src={profilePic} />
          <Box ml='3'>
            <Text fontWeight='bold'>
              {name}
              <Badge ml='1' colorScheme='green'>
                New
              </Badge>
            </Text>
            <Text fontSize='sm' className="tw-font-main tw-text-gray-400 tw-text-right tw-pr-5">More Options</Text>
          </Box>
        </Flex>
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => {signOut();router.push("/api/auth/signout");}}>Log out</MenuItem>
      </MenuList>
    </Menu>
  </>)

}

/*<div className={`${styles["nosqueeze"]} ${styles["btn-hover"]} ${styles["color-1"]}`} onClick={signOutClick}>
      Sign out
    </div>*/

function Navbar() {
  const links = useRef();
  const router = useRouter()
  const { data: session } = useSession()
  if (session) {
    var buttonContent = <>
      <BadgePP name={session.user.name} profilePic={session.user.image}/>
    </>
  } else {
    var buttonContent = <>
      <div className={`${styles["btn-hover"]} ${styles["color-1"]}`} onClick={signInClick}>
        Login
      </div>
      <div className={`${styles["btn-hover"]} ${styles["color-10"]}`} onClick={signupClick}>
        Sign up
      </div>
    </>
  }


  function logoClick() {
    router.push("/")
  };

  function signInClick() {
    router.push("/api/auth/signin")
  };

  function signOutClick() {
    signOut();
    router.push("/")
  };

  function signupClick() {
    router.push("/api/auth/signin");
  };

  function hamburgerClicked() {

  };

//<object data={"/svgs/wepyk-logo.svg"} type="image/svg+xml" className={styles.logo} onClick={logoClick}></object>
  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.basebar}>    
          <div className="tw-text-center sm:tw-text-left tw-px-2 tw-flex flex-col tw-flex-wrap tw-content-center tw-text-white tw-font-thin tw-text-3xl tw-flex-grow "><h1 className={`tw-block tw-w-full ${styles.logo}`}>ChimpBase</h1></div>
          <div className={styles.grower} />
          <div className={styles.navlinks} ref={links}>
            {buttonContent}
          </div>
        </div>
      </div>
    </>
  );
}
export default Navbar;