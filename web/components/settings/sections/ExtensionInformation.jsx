import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    Box,
    Button,
    Input,
    InputGroup,
    InputRightElement,
    FormControl,
    FormLabel,
} from '@chakra-ui/react';
import styled from 'styled-components'
import {SettingsContext} from "../context";

const StyledButton = styled(Button)`
  color: black;
  margin-right: 5px;
`

const ChromeExtensionKey = () => {
    const {chromeExtensionKey} = useContext(SettingsContext);

    const [isCopied, setIsCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(chromeExtensionKey);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
    };

    return (
        <FormControl>
            <FormLabel fontWeight={300}>Chrome Extension Key</FormLabel>
            <InputGroup size='md'>
                <Input
                    pr='4.5rem'
                    value={chromeExtensionKey}
                    type={'password'}
                    placeholder='Chrome Extension Key'
                    isReadOnly={true}
                    borderColor={'gray.600'}
                />
                <InputRightElement width='4.5rem'>
                    <StyledButton onClick={handleCopy} h='1.75rem' size='sm'
                                  color={'#fff'}
                                  fontWeight={300}
                                  bg="gray.600"
                                  _hover={{bg: 'gray.500'}}
                                  _active={{bg: 'gray.700'}}>
                        {isCopied ? 'Copied!' : 'Copy'}
                    </StyledButton>
                </InputRightElement>
            </InputGroup>
        </FormControl>
    );
};

const Container = styled.div`
  font-weight: 300;
`

function ExtensionInformation(props) {
    return (
        <Container><ChromeExtensionKey/></Container>
    );
}

export default ExtensionInformation;