import {createContext, createRef, useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";

export const SettingsContext = createContext();

import React from 'react';
import axios from "axios";

function SettingsContextProvider({children}) {
    const [name, setName] = useState('');
    const [chromeExtensionKey, setChromeExtensionKey] = useState('');

    useEffect(() => {
        axios.get('/api/user/settings/',).then(res => {
            setName(res.data.name)
            setChromeExtensionKey(res.data.apiKey)
        }).catch(err => {
            console.log(err)
        })
    }, [])


    return (
        <SettingsContext.Provider value={{
            name,
            setName,
            chromeExtensionKey
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export default SettingsContextProvider;