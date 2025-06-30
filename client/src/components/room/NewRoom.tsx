import React, { useContext, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Plus, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AppContext } from "@/AppContextProvider";

const NewRoom = () => {
  const [createRoom, setCreateRoom] = useState({ maxPlayers: 2, stake: 0.01 });
  const { selectedAvatar, accountInfo, socket } = useContext(AppContext)!;

  const handleCreateRoom = async () => {
    if (!socket || !accountInfo) {
      return;
    }

    try {
      socket.send(
        JSON.stringify({
          type: "create-room",
          payload: {
            userId: accountInfo.userId,
            userName: accountInfo.userName,
            stake: createRoom.stake,
            maxPlayers: createRoom.maxPlayers,
          },
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Card className="bg-neutral-800/70 border-purple-500 shadow-xl">
      <CardHeader>
        <CardTitle className="text-purple-300 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create New Room
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-300">
              Max Players
            </label>
            <Select
              value={createRoom.maxPlayers.toString()}
              onValueChange={(value) =>
                setCreateRoom({
                  ...createRoom,
                  maxPlayers: Number(value),
                })
              }
            >
              <SelectTrigger className="bg-purple-950/50 border-purple-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-purple-950 border-purple-700">
                <SelectItem value="2">2 Players</SelectItem>
                <SelectItem value="3">3 Players</SelectItem>
                <SelectItem value="5">5 Players</SelectItem>
                <SelectItem value="8">8 Players</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-300">
              Stake (GORB)
            </label>
            <Input
              type="number"
              value={createRoom.stake}
              onChange={(e) =>
                setCreateRoom({
                  ...createRoom,
                  stake: parseFloat(e.target.value) || 0,
                })
              }
              className="bg-purple-950/50 border-purple-700 text-white"
              min={0.01}
              step={0.01}
              max={100}
            />
          </div>
        </div>

        <Button
          onClick={handleCreateRoom}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3"
        >
          {true ? (
            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          Create Room
        </Button>
      </CardContent>
    </Card>
  );
};

export default NewRoom;
