import React, { createContext, useContext, useEffect, useState } from "react";
import { getDomain } from "helpers/getDomain";

const WebSocketContext = createContext<WebSocket | null>(null);

export const useWebSocket = (): WebSocket | null => {
  return useContext(WebSocketContext);
};

interface WebSocketProviderProps {
  children: React.ReactNode;
  token: string | null;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
  token,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  function getDomain2() {
    const serverURL = getDomain();
    const domain = serverURL.replace(/^https?:\/\//, "");
    return domain;
  }

  useEffect(() => {
    if (token) {
      console.log("Token has been submitted: " + token);
      const protocol =
        window.location.protocol === "https:" ? "wss://" : "ws://";

      const websocketAddress = protocol + getDomain2() + "/topic/" + token;
      console.log("Websocket address: " + websocketAddress);
      const ws = new WebSocket(websocketAddress);

      setSocket(ws);

      return () => {
        ws.close();
      };
    }
  }, [token]);
  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};
