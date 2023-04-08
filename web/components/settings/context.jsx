import {createContext, useEffect, useState} from "react";
import LargeLoadingSpinner from "../LargeLoadingSpinner";

export const SettingsContext = createContext();
import React from 'react';

function SettingsContextProvider({children}) {
    const [name, setName] = useState('');
    const [chromeExtensionKey, setChromeExtensionKey] = useState('');

    useEffect(() => {
        fetch('/api/user/settings/')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => {
                setName(data.name);
                setChromeExtensionKey(data.apiKey);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [])


    return (
        <SettingsContext.Provider value={{
            name,
            setName,
            chromeExtensionKey
        }}>
            {
                (name === '' && chromeExtensionKey === '') ?
                    <LargeLoadingSpinner/>
                    : <>{children}</>
            }
        </SettingsContext.Provider>
    );
}

export default SettingsContextProvider;