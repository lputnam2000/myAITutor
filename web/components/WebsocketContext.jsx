import {createContext, useCallback, useEffect, useState} from "react";
import {useSession} from "next-auth/react"
import io from 'socket.io-client';
import React from 'react';
import axios from "axios";

export const WebsocketContext = createContext({socket: undefined});


function WebsocketContextProvider({children}) {
    const [socket, setSocket] = useState(null);
    const [authToken, setAuthToken] = useState(null);
    const [variableState, setVariableState] = useState(null);
    const {data: session} = useSession();
    const [callbacks, setCallbacks] = useState([]);
    const socketServerURL = "wss://sockets.chimpbase.com"//process.env.NEXT_PUBLIC_SOCKET_SERVER_URL

    const handle_push_to_user = useCallback(
        (data) => {
            console.log('handle_push_to_user: ', data);
            callbacks.forEach((cb) => cb(data));
        }, [callbacks]
    );

    const addCallback = useCallback(
        (callback) => {
            setCallbacks((prevCallbacks) => [...prevCallbacks, callback]);
        }, [setCallbacks]
    );

    const removeCallback = useCallback(
        (callback) => {
            setCallbacks((prevCallbacks) =>
                prevCallbacks.filter((cb) => cb !== callback)
            );
        }, [setCallbacks]
    );


    useEffect(() => {
        const handleSocketDisconnect = () => {
            console.log('Socket disconnected unexpectedly');
            setSocket(null);
        };
        if (socket) {
            socket.on('disconnect', handleSocketDisconnect);
            return () => {
                socket.off('disconnect', handleSocketDisconnect);
                socket.disconnect();
            };
        }
    }, [socket]);

    const fetchData = useCallback(async () => {
        try {
            if (!authToken) {
                const response = await axios.get('/api/user/getDataTetherJWT');
                setAuthToken(response.data.token);
            }
        } catch (error) {
            console.log(error);
        }
    }, [setAuthToken, authToken])

    useEffect(() => {
        if (session) {
            fetchData();
        } else {
            setAuthToken(null);
        }
    }, [session, fetchData]);

    useEffect(() => {
        if (authToken && !socket) {
            const newSocket = io(socketServerURL, {
                query: {token: authToken},
                transports: ['websocket']
            });

            // Handle socket connection errors
            const handleSocketError = (error) => {
                console.log('Socket connection error', error);
                setSocket(null);
            };

            newSocket.on('redis_update', (data) => {
                console.log('redis_update: ', data);
                setVariableState(data.toString());
            });

            newSocket.on('push_to_user', (data) => {
                handle_push_to_user(data);
            });

            newSocket.on('connect_error', handleSocketError);
            newSocket.on('connect_timeout', handleSocketError);
            newSocket.on('error', handleSocketError);

            setSocket(newSocket);
        }
    }, [authToken, socket, handle_push_to_user]);

    const contextValue = {socket, variableState, addCallback, removeCallback};

    return (
        <WebsocketContext.Provider value={contextValue}>
            {children}
        </WebsocketContext.Provider>
    );
}

export default WebsocketContextProvider;