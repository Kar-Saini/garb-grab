import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Users } from "lucide-react";
import { Button } from "../ui/button";

const AvailableRooms = () => {
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
  return (
    <Card className="bg-neutral-800/70 border-purple-500 shadow-xl w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-purple-300 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Available Rooms (
            {availableRooms.filter((r) => r.status === "waiting").length})
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {availableRooms.length === 0 ? (
            <div className="text-center py-8 text-purple-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No active rooms available</p>
              <p className="text-sm">Create a new room to get started!</p>
            </div>
          ) : (
            availableRooms.map((room, index) => (
              <div
                key={index}
                className="group flex items-center justify-between bg-gradient-to-r from-purple-900/50 to-neutral-900/50 px-4 py-3 rounded-lg border border-purple-700/50 hover:border-purple-500 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${room.status}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium">
                        {room.roomId}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      ></Button>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-purple-300">
                      <span>
                        {room.players}/{room.maxPlayers} players
                      </span>
                      <span>{room.stake} GORB</span>
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
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
  );
};

export default AvailableRooms;
