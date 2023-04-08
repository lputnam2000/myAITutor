import React, {useContext, useEffect, useState} from 'react';
import {
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    IconButton,
} from '@chakra-ui/react';
import {EditIcon, CheckIcon, CloseIcon} from '@chakra-ui/icons';
import styled from 'styled-components'
import {SettingsContext} from "../context";

const Container = styled.div`
  font-weight: 300;
`
const EditIconsContainer = styled.div`
  display: flex;
  margin-right: 37px;
`

const UserInformation = () => {
    const {name, setName} = useContext(SettingsContext);
    const [editMode, setEditMode] = useState(false);
    const [tempFullName, setTempFullName] = useState('');

    useEffect(() => {
        setTempFullName(name)
    }, [name]);


    const handleEdit = () => {
        setEditMode(true);
        setTempFullName(name);
    };

    const handleSave = () => {
        let params = {
            'newName': tempFullName
        }
        fetch('/api/user/settings/name', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => {
                // Handle the response data here
            })
            .catch((err) => {
                console.log(err);
            });
        setName(tempFullName);
        setEditMode(false);
    };

    const handleCancel = () => {
        setEditMode(false);
    };

    return (
        <Container>
            <FormControl>
                <FormLabel fontWeight={300}>Name</FormLabel>
                <InputGroup>
                    <Input
                        borderColor={'gray.600'}
                        placeholder={'Enter your name'}
                        type="text"
                        value={editMode ? tempFullName : name}
                        readOnly={!editMode}
                        onChange={(e) => setTempFullName(e.target.value)}
                    />
                    <InputRightElement>
                        {editMode ? (
                            <EditIconsContainer>
                                <IconButton
                                    icon={<CheckIcon color={'#fff'}/>}
                                    onClick={handleSave}
                                    aria-label="Save"
                                    mr={1}
                                    size='sm'
                                    bg="gray.600"
                                    _hover={{bg: 'gray.500'}}
                                    _active={{bg: 'gray.700'}}
                                />
                                <IconButton
                                    icon={<CloseIcon color={'#fff'}/>}
                                    onClick={handleCancel}
                                    aria-label="Cancel"
                                    size='sm'
                                    bg="gray.600"
                                    _hover={{bg: 'gray.500'}}
                                    _active={{bg: 'gray.700'}}
                                />
                            </EditIconsContainer>
                        ) : (
                            <IconButton
                                icon={<EditIcon color={'#fff'}/>}
                                onClick={handleEdit}
                                aria-label="Edit"
                                size='sm'
                                bg="gray.600"
                                _hover={{bg: 'gray.500'}}
                                _active={{bg: 'gray.700'}}
                            />
                        )}
                    </InputRightElement>
                </InputGroup>
            </FormControl>
        </Container>
    );
};

export default UserInformation;
