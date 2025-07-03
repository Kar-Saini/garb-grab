import { useContext, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AppContext } from "@/AppContextProvider";
import { INCOMMING_MESSAGE } from "@/lib/types";
import toast from "react-hot-toast";

const NewRoom = () => {
  const [createRoom, setCreateRoom] = useState({ maxPlayers: 2, stake: 0.01 });
  const { accountInfo, socket, setRoomInformation, navigate, selectedAvatar } =
    useContext(AppContext)!;

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const parsedData: INCOMMING_MESSAGE = JSON.parse(event.data);
      console.log(parsedData);
      switch (parsedData.type) {
        case "room-created":
          console.log("create room recevied");
          setRoomInformation(parsedData.payload);
          console.log(parsedData);
          toast.success("Room created");
          navigate(`/canvas`);
          break;
        case "user-joined-room":
          setRoomInformation(parsedData.payload);
          navigate(`/canvas`);
          break;
      }
    };
  }, [socket]);

  const handleCreateRoom = async () => {
    if (!socket || !accountInfo) {
      toast.error("Error");
      return;
    }
    socket.send(
      JSON.stringify({
        type: "create-room",
        payload: {
          adminId: accountInfo.userId,
          userId: accountInfo.userId,
          userName: accountInfo.userName,
          stake: createRoom.stake,
          maxPlayers: createRoom.maxPlayers,
          avatar: selectedAvatar,
        },
      })
    );
  };

  return (
    <Card className="bg-neutral-800/70 border border-purple-500 shadow-xl flex-1 justify-evenly">
      <CardHeader>
        <CardTitle className="text-purple-300 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create New Room
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 ">
          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-300">
              Max Players
            </label>
            <Select
              value={createRoom.maxPlayers.toString()}
              onValueChange={(value) =>
                setCreateRoom((prev) => ({
                  ...prev,
                  maxPlayers: Number(value),
                }))
              }
            >
              <SelectTrigger className="bg-purple-950/50 border border-purple-700 text-white">
                <SelectValue placeholder="Select players" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-purple-700 text-white">
                <SelectItem value="2">2 Players</SelectItem>
                <SelectItem value="3">3 Players</SelectItem>
                <SelectItem value="5">5 Players</SelectItem>
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
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 hover:cursor-pointer"
        >
          Create Room
        </Button>
      </CardContent>
    </Card>
  );
};

export default NewRoom;
