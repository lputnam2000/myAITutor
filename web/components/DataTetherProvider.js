import { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const DataTetherContext = createContext();

const DataTetherProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [variableState, setVariableState] = useState(null);
  const { data: session } = useSession();
  const [callbacks, setCallbacks] = useState([]);

  const handle_push_to_user = (data) => {
    console.log('handle_push_to_user: ', data);
    callbacks.forEach((cb) => cb(data));
  };

  function addCallback(callback) {
    setCallbacks((prevCallbacks) => [...prevCallbacks, callback]);
  }

  function removeCallback(callback) {
    setCallbacks((prevCallbacks) =>
      prevCallbacks.filter((cb) => cb !== callback)
    );
  }

  useEffect(() => {
    console.log('DataTetherProvider mounted!');
    console.log('Session is: ', session);
    console.log('Datatether JWT is: ', authToken);
    console.log('Socket is: ', socket);

    // Handle unexpected socket disconnection
    const handleSocketDisconnect = () => {
      console.log('Socket disconnected unexpectedly');
      setSocket(null);
    };

    if (socket) {
      socket.on('disconnect', handleSocketDisconnect);
      return () => {
        console.log('shutting down data tether socket');
        socket.off('disconnect', handleSocketDisconnect);
        socket.disconnect();
      };
    }
  }, [socket]);

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
      const newSocket = io('localhost:5050', {
        query: { token: authToken },
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
  }, [authToken, socket]);

  const contextValue = { socket, variableState, addCallback, removeCallback };

  return (
    <DataTetherContext.Provider value={contextValue}>
      {children}
    </DataTetherContext.Provider>
  );
};

export { DataTetherContext, DataTetherProvider };
