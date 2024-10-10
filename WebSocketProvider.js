import React, { createContext, useEffect, useState } from 'react';
import { BASE_URL_WS } from './app/screens/config';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(BASE_URL_WS);
    
    ws.onopen = () => {
      console.log('Conectado ao WebSocket');
    };

    ws.onmessage = (event) => {
      console.log('Mensagem recebida do servidor:', event.data);
    };

    ws.onclose = () => {
      console.log('WebSocket desconectado');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};
