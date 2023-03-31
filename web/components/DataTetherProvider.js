import { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import {useSession} from "next-auth/react"

const DataTetherContext = createContext();

const DataTetherProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [variableState, setVariableState] = useState(null);
  const {data: session} = useSession()

  useEffect(() => {
    console.log('DataTetherProvider mounted!');
    console.log('Session is: ', session)
    console.log('Datatether JWT is: ', authToken)
    console.log('Socket is: ', socket)
  }, [])
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!authToken) {
            const response = await axios.get('/api/user/getDataTetherJWT');
            setAuthToken(response.data.token);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (session) {
      fetchData();
    } else {
      setAuthToken(null);
    }
  }, [session]);

  useEffect(() => {
    if (authToken && !socket) {
      const newSocket = io("localhost:5050", {
        query: { token: authToken },
      });

      newSocket.on('redis_update', (data) => {
        console.log("redis_update: ", data);
        setVariableState(data.toString());
      });

      setSocket(newSocket);
    }

    return () => {
      if (socket) {
        console.log("shutting down data tether socket")
        socket.disconnect();
      }
    };
  }, [authToken, socket]);

  return (
    <DataTetherContext.Provider value={{ socket, authToken, variableState }}>
      {children}
    </DataTetherContext.Provider>
  );
};

export { DataTetherContext, DataTetherProvider };
