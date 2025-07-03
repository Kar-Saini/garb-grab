import { useContext, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { LogIn } from "lucide-react";
import { Button } from "../ui/button";
import { AppContext } from "@/AppContextProvider";

const JoinRoom = () => {
  const { socket, accountInfo } = useContext(AppContext)!;
  const [joinRoomId, setJoinRoomId] = useState("");
  console.log(joinRoomId);
  const handleJoinRoom = () => {
    socket?.send(
      JSON.stringify({
        type: "join-room",
        payload: {
          userId: accountInfo?.userId,
          roomId: joinRoomId,
        },
      })
    );
  };

  return (
    <Card className="bg-neutral-800/70 border-purple-500 shadow-xl flex-1 justify-evenly">
      <CardHeader>
        <CardTitle className="text-purple-300 flex items-center gap-2">
          <LogIn className="w-5 h-5" />
          Join a Room
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full space-y-4">
          <label className="text-sm font-medium text-purple-300">Room ID</label>
          <Input
            type="text"
            placeholder="12345678"
            value={joinRoomId}
            onChange={(e) => setJoinRoomId(e.target.value)}
            className="flex-1 bg-purple-950/50 border-purple-700 text-white placeholder-purple-300 focus:border-purple-500"
          />
          <Button
            onClick={() => handleJoinRoom()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 hover:cursor-pointer"
          >
            Join
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JoinRoom;
