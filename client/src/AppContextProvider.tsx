// socket-context.tsx
import React, { createContext, useEffect, useState } from "react";
import { UserAccountInfo } from "./lib/types";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { AVATAR_LIST } from "./lib/constants";

interface AppContextType {
  socket: WebSocket | null;
  userName: string | null;
  setUserName: (val: string) => void;
  accountInfo: UserAccountInfo | null;
  setAccountInfo: React.Dispatch<React.SetStateAction<UserAccountInfo | null>>;
  selectedAvatar: string | null;
  setSelectedAvatar: (val: string) => void;
  navigate: NavigateFunction;
}

export const AppContext = createContext<AppContextType | null>(null);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [accountInfo, setAccountInfo] = useState<UserAccountInfo | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(
    AVATAR_LIST[0]
  );
  const navigate = useNavigate();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      console.log("WebSocket connected");
      setSocket(ws);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        socket,
        userName,
        setUserName,
        accountInfo,
        setAccountInfo,
        selectedAvatar,
        setSelectedAvatar,
        navigate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
