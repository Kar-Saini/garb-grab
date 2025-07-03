import React, { createContext, useEffect, useState } from "react";
import {
  AppContextType,
  RoomInformationType,
  UserAccountInfo,
} from "./lib/types";
import { useNavigate } from "react-router-dom";
import { AVATAR_LIST } from "./lib/constants";

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
  const [roomInformation, setRoomInformation] =
    useState<RoomInformationType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ws = new WebSocket(
      import.meta.env.VITE_WS_SERVER || "ws://localhost:8080"
    );
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
        roomInformation,
        setRoomInformation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
