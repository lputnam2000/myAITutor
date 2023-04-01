import {createContext, useEffect, useState} from "react";
import {useSession} from "next-auth/react"
import io from 'socket.io-client';
import React from 'react';

export const WebsocketContext = createContext({socket: undefined});


function WebsocketContextProvider({children}) {
    const [socket, setSocket] = useState(null);
    const {data} = useSession();

    useEffect(() => {
        if (data) {
            const socket = io(`http://127.0.0.1:5000`);
            socket.on('user_update', (data) => {
                console.log('Update received:', data);
                // Handle the data/update as needed
            });


            socket.emit('join', {userId: data.user.id});

            setSocket(socket);

            return () => {
                socket.emit('leave', {userId: data.user.id});
                socket.disconnect();
            };
        }
    }, [data]);


    return (
        <WebsocketContext.Provider value={{
            socket
        }}>
            {children}
        </WebsocketContext.Provider>
    );
}

export default WebsocketContextProvider;