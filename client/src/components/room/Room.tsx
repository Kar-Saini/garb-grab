import { AppContext } from "@/AppContextProvider";
import { useContext } from "react";

import NewRoom from "./NewRoom";
import AvatarInfoCard from "./AvatarInfoCard";
import JoinRoom from "./JoinRoom";

const RoomLobby = () => {
  const { selectedAvatar, accountInfo } = useContext(AppContext)!;
  if (!selectedAvatar || !accountInfo) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 lg:p-6">
      <div className="max-w-7xl mx-auto flex flex-col justify-evenly">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            Game Lobby
          </h1>
          <p className="text-purple-300">
            Create or join a room to start playing
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <AvatarInfoCard />
          </div>
          <div className="lg:col-span-3 flex space-x-4">
            <div className="w-full flex gap-4">
              <NewRoom />
              <JoinRoom />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomLobby;
