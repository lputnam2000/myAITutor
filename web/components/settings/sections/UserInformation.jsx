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
import axios from "axios";

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
        axios
            .patch("/api/user/settings/name", {}, {params: params})
            .then((res) => {

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
