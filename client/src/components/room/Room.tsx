import { AppContext } from "@/AppContextProvider";
import { useContext, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users, RefreshCw, LogIn, Copy, Check } from "lucide-react";
import NewRoom from "./NewRoom";

const RoomLobby = () => {
  const { selectedAvatar, accountInfo, socket } = useContext(AppContext)!;
  const [joinRoomId, setJoinRoomId] = useState("");
  const [availableRooms, setAvailableRooms] = useState([
    {
      roomId: "room-123",
      players: 1,
      maxPlayers: 2,
      stake: 0.01,
      status: "waiting",
    },
    {
      roomId: "room-456",
      players: 2,
      maxPlayers: 3,
      stake: 0.1,
      status: "playing",
    },
    {
      roomId: "room-789",
      players: 1,
      maxPlayers: 5,
      stake: 0.05,
      status: "waiting",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedRoomId, setCopiedRoomId] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setAvailableRooms((rooms) =>
        rooms.map((room) => ({
          ...room,
          players: Math.max(
            1,
            Math.min(
              room.maxPlayers,
              room.players + Math.floor(Math.random() * 3) - 1
            )
          ),
        }))
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!selectedAvatar || !accountInfo) return null;

  const handleJoinRoom = async (roomId?: string) => {
    const targetRoomId = roomId || joinRoomId;
    if (!targetRoomId.trim() || !socket) {
      return;
    }

    setIsLoading(true);
    try {
      socket.send(
        JSON.stringify({
          type: "join-room",
          payload: {
            userId: accountInfo.userId,
            roomId: targetRoomId,
          },
        })
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyRoomId = async (roomId: string) => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopiedRoomId(roomId);
      setTimeout(() => setCopiedRoomId(""), 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const getStatusColor = (status: string) => {
    return status === "waiting" ? "bg-green-500" : "bg-yellow-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            Game Lobby
          </h1>
          <p className="text-purple-300">
            Create or join a room to start playing
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="bg-neutral-800/70 border-purple-500 shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
              <CardHeader className="text-center"></CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <img
                    src={selectedAvatar}
                    alt="Selected Avatar"
                    width={120}
                    height={120}
                    className="rounded-full object-cover ring-4 ring-purple-600 shadow-lg group-hover:ring-purple-400 transition-all duration-300"
                  />
                  <div className="absolute inset-0 rounded-full bg-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="w-full space-y-3">
                  <div className="text-center">
                    <p className="text-sm text-purple-400 uppercase tracking-wide">
                      Username
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {accountInfo.userName}
                    </p>
                  </div>

                  <Separator className="bg-purple-700" />

                  <div className="text-center">
                    <p className="text-sm text-purple-400 uppercase tracking-wide">
                      User ID
                    </p>
                    <p className="text-xs font-mono text-gray-300 break-all bg-neutral-900 rounded p-2">
                      {accountInfo.userId}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
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
                    placeholder="Enter Room ID (e.g., room-123)"
                    value={joinRoomId}
                    onChange={(e) => setJoinRoomId(e.target.value)}
                    className="flex-1 bg-purple-950/50 border-purple-700 text-white placeholder-purple-300 focus:border-purple-500"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => handleJoinRoom()}
                    disabled={isLoading || !joinRoomId.trim()}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      "Join Room"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-800/70 border-purple-500 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-purple-300 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Available Rooms (
                    {
                      availableRooms.filter((r) => r.status === "waiting")
                        .length
                    }
                    )
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefreshRooms}
                    disabled={isRefreshing}
                    className="border-purple-600 text-purple-300 hover:bg-purple-600/20"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${
                        isRefreshing ? "animate-spin" : ""
                      }`}
                    />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {availableRooms.length === 0 ? (
                    <div className="text-center py-8 text-purple-400">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No active rooms available</p>
                      <p className="text-sm">
                        Create a new room to get started!
                      </p>
                    </div>
                  ) : (
                    availableRooms.map((room, index) => (
                      <div
                        key={index}
                        className="group flex items-center justify-between bg-gradient-to-r from-purple-900/50 to-neutral-900/50 px-4 py-3 rounded-lg border border-purple-700/50 hover:border-purple-500 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full ${getStatusColor(
                              room.status
                            )}`}
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-medium">
                                {room.roomId}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyRoomId(room.roomId)}
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                {copiedRoomId === room.roomId ? (
                                  <Check className="w-3 h-3 text-green-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </Button>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-purple-300">
                              <span>
                                {room.players}/{room.maxPlayers} players
                              </span>
                              <span>{room.stake} GORB</span>
                              <Badge variant="secondary" className="text-xs">
                                {room.status}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          onClick={() => handleJoinRoom(room.roomId)}
                          disabled={
                            isLoading ||
                            room.players >= room.maxPlayers ||
                            room.status === "playing"
                          }
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          {room.status === "playing"
                            ? "In Progress"
                            : room.players >= room.maxPlayers
                            ? "Full"
                            : "Join"}
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
            <NewRoom />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomLobby;
