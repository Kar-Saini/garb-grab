import { useContext, useEffect, useState } from "react";
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
    <Card className="bg-neutral-800/70 border-purple-500 shadow-xl">
      <CardHeader>
        <CardTitle className="text-purple-300 flex items-center gap-2">
          <LogIn className="w-5 h-5" />
          Join a Room
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="text"
            placeholder="Enter Room ID"
            value={joinRoomId}
            onChange={(e) => setJoinRoomId(e.target.value)}
            className="flex-1 bg-purple-950/50 border-purple-700 text-white placeholder-purple-300 focus:border-purple-500"
          />
          <Button
            onClick={() => handleJoinRoom()}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 hover:cursor-pointer"
          >
            Join
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JoinRoom;
