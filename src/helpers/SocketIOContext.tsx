import React, { createContext, useContext, useEffect, useState } from "react";

import { io, Socket } from "socket.io-client";
import { getDomain } from "helpers/getDomain";

interface SocketIOContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketIOContext = createContext<SocketIOContextType>({
  socket: null,
  isConnected: false,
});

export const useSocketIO = (): SocketIOContextType => {
  return useContext(SocketIOContext);
};

interface SocketIOProviderProps {
  children: React.ReactNode;
  token: string | null;
}

export const SocketIOProvider: React.FC<SocketIOProviderProps> = ({
  children,
  token,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [contextValue, setContextValue] = useState<SocketIOContextType>({
    socket: null,
    isConnected: false,
  });
  const [isConnected, setIsConnected] = useState<boolean>(false);

  function getDomain2() {
    const serverURL = getDomain();
    const domain = serverURL.replace(/^https?:\/\//, "");
    const domain2 = domain.replace("8080", "8081");
    const domain3 = "http://localhost:8081";
    return domain3;
  }

  useEffect(() => {
    let socketInstance: Socket | null = null;
    if (token) {
      console.log("Token has been submitted: " + token);

      const serverURL = getDomain2();
      const socketAddress = `${serverURL}/?token=${token}`;
      console.log("Socket.IO address: " + socketAddress);

      const socketInstance = io(socketAddress, {
        autoConnect: true,
        transports: ["websocket"],
      });

      socketInstance.connect();
      socketInstance.on("connect", () => {
        console.log("Socket connected");
        setIsConnected(true);
      });

      setSocket(socketInstance);
      console.log("Socket instance created and connected", socketInstance);
      return () => {
        socketInstance.disconnect();
      };
    }
  }, [token]);

  useEffect(() => {
    setContextValue({ socket, isConnected });
  }, [socket, isConnected]);

  return (
    <SocketIOContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketIOContext.Provider>
  );
};
