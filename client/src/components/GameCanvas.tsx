import { AppContext } from "@/AppContextProvider";
import { GRID_SIZE } from "@/lib/constants";
import { INCOMMING_MESSAGE } from "@/lib/types";
import { useContext, useEffect, useRef, useState } from "react";
import StakeModal from "./StakeAmount";
import toast from "react-hot-toast";

const GameCanvas = () => {
  const { roomInformation, socket, setRoomInformation, navigate, accountInfo } =
    useContext(AppContext)!;
  if (!roomInformation?.roomId || !accountInfo) {
    navigate("/");
  }
  const [players, setPlayers] = useState(roomInformation?.currentPlayers);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [coins, setCoins] = useState<{ id: number; x: number; y: number }[]>(
    []
  );
  const coinQueue = useRef<{ id: number; x: number; y: number }[]>([]);

  const [currentCoins, setCurrentCoins] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const movePlayer = (playerId: string, dx: number, dy: number) => {
    if (!players) return;

    setPlayers((prevPlayers) =>
      prevPlayers?.map((player) => {
        if (player.userId === playerId) {
          const newX = Math.max(0, Math.min(GRID_SIZE - 1, player.x + dx));
          const newY = Math.max(0, Math.min(GRID_SIZE - 1, player.y + dy));
          const coin = currentCoins.find(
            (coin) => coin.x === newX && coin.y === newY
          );

          if (coin) {
            setCurrentCoins((prev) => prev.filter((c) => c.id !== coin.id));
            socket?.send(
              JSON.stringify({
                type: "coin-collected",
                payload: {
                  roomId: roomInformation?.roomId,
                  playerId,
                  coinId: coin.id,
                },
              })
            );

            // ✅ Update player’s coinsWon count locally
            setPlayers((players) =>
              players?.map((p) =>
                p.userId === playerId ? { ...p, coinsWon: p.coinsWon + 1 } : p
              )
            );
          }

          socket?.send(
            JSON.stringify({
              type: "player-move",
              payload: {
                roomId: roomInformation?.roomId,
                playerId,
                newX,
                newY,
              },
            })
          );

          return { ...player, x: newX, y: newY };
        }
        return player;
      })
    );
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (
      roomInformation?.currentPlayers.length === roomInformation?.maxPlayer &&
      coinQueue.current.length > 0
    ) {
      toast.success("Coins dropping in 3 seconds!");
      setTimeout(() => {
        interval = setInterval(() => {
          const nextCoin = coinQueue.current.shift();
          if (nextCoin) {
            setCurrentCoins((prev) => [...prev, nextCoin]);
          }
        }, 2000);
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [roomInformation?.currentPlayers.length, roomInformation?.maxPlayer]);

  useEffect(() => {
    if (!accountInfo) return;
    const moveHandler = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w":
          movePlayer(accountInfo.userId!, 0, -1);
          break;
        case "a":
          movePlayer(accountInfo.userId!, -1, 0);
          break;
        case "s":
          movePlayer(accountInfo.userId!, 0, 1);
          break;
        case "d":
          movePlayer(accountInfo.userId!, 1, 0);
          break;
      }
    };
    window.addEventListener("keypress", moveHandler);
    return () => {
      window.removeEventListener("keypress", moveHandler);
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const parsedData: INCOMMING_MESSAGE = JSON.parse(event.data);
      console.log(parsedData);

      switch (parsedData.type) {
        case "user-joined-room":
          console.log(parsedData);
          setRoomInformation(parsedData.payload);
          setPlayers(parsedData.payload.currentPlayers);
          navigate(`/canvas`);
          break;
        case "player-moved":
          console.log(parsedData.payload);
          console.log("Before getting move event");
          console.log(players);
          setPlayers((prev) =>
            prev?.map((player) => {
              if (player.userId == parsedData.payload.playerId) {
                return {
                  ...player,
                  x: parsedData.payload.newX,
                  y: parsedData.payload.newY,
                };
              }
              return player;
            })
          );
          break;
        case "game-started":
          setCoins(parsedData.payload.coins);
          coinQueue.current = [...parsedData.payload.coins]; // for animation
          console.log(coins);
          break;
        case "coin-collected": {
          const { coinId, playerId } = parsedData.payload;
          setCurrentCoins((prev) => prev.filter((coin) => coin.id !== coinId));
          setPlayers((prev) =>
            prev?.map((player) =>
              player.userId === playerId
                ? { ...player, coinsWon: player.coinsWon + 1 }
                : player
            )
          );
          break;
        }
      }
    };
  }, [socket, setRoomInformation, navigate, players]);
  console.log(coins);

  function handleStartGame() {
    setShowModal(true);
    socket?.send(
      JSON.stringify({
        type: "start-game",
        payload: { roomId: roomInformation?.roomId },
      })
    );
  }

  return (
    <div className="relative">
      {showModal && (
        <StakeModal
          isOpen={showModal}
          roomId={roomInformation?.roomId as string}
          stakeAmount={roomInformation?.stakeAmount as number}
          onClose={() => setShowModal(false)}
        />
      )}
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col px-4 py-2">
        <div className="flex w-full border-[1px] border-purple-500 rounded-xl">
          <div className="rounded-lg p-4 flex flex-1 gap-2">
            {players?.map((player) => (
              <div
                key={player.userId}
                className={`flex items-center gap-2 py-1 px-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl ${
                  accountInfo?.userId === player.userId &&
                  "border-[4px] border-green-500"
                }`}
              >
                <img
                  src={player.avatar}
                  alt={`Avatar`}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
                <span className="flex flex-col">
                  <p className="text-sm font-mono font-bold text-neutral-100 whitespace-nowrap">
                    {player.userName} : {player.coinsWon}
                  </p>
                  <p className="text-[10px] text-neutral-200">
                    {player.userId}
                  </p>
                </span>
              </div>
            ))}
          </div>
          <div className="w-full rounded-lg px-6 flex flex-1 justify-between items-center">
            <RoomDetailBox
              label="Players"
              value={`${roomInformation?.currentPlayers.length} / ${roomInformation?.maxPlayer}`}
            ></RoomDetailBox>
            <RoomDetailBox
              label="Room ID"
              value={roomInformation?.roomId as string}
            />
            <RoomDetailBox
              label="Stake"
              value={roomInformation?.stakeAmount as number}
            />
            <RoomDetailBox
              label="Win"
              value={roomInformation?.winAmount.toFixed(3) as unknown as number}
            />
            <RoomDetailBox
              label="Coins"
              value={roomInformation?.numOfCoins as number}
            />

            <button
              className={` text-white px-4 py-2 rounded-lg font-semibold ${
                roomInformation?.currentPlayers.length !==
                roomInformation?.maxPlayer
                  ? "bg-neutral-500"
                  : "bg-pink-600 hover:bg-pink-700"
              }`}
              disabled={
                roomInformation?.currentPlayers.length !==
                roomInformation?.maxPlayer
              }
              onClick={handleStartGame}
            >
              Start Game
            </button>
          </div>
        </div>

        <div className="flex-grow flex justify-center items-center">
          <div className="grid grid-cols-8 gap-2 p-2 rounded-lg w-fit">
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);
              const playersHere = players?.filter(
                (player) => player.x === x && player.y === y
              );
              const coinHere = currentCoins.find(
                (coin) => coin.x === x && coin.y === y
              );

              return (
                <div
                  key={index}
                  className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 border-gray-200 rounded relative flex items-center justify-center"
                >
                  {playersHere?.map((player, idx) => (
                    <img
                      key={player.userId}
                      src={player.avatar}
                      alt="Avatar"
                      width={46}
                      height={46}
                      className="rounded-full object-cover border-2 border-white absolute transition-transform duration-300"
                      style={{
                        transform: `translate(${idx * 10}px, ${idx * 10}px)`,
                        zIndex: 10 + idx,
                      }}
                    />
                  ))}
                  {coinHere && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-yellow-600 flex items-center justify-center text-xs font-bold animate-pulse">
                        💰
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCanvas;

function RoomDetailBox({
  label,
  value,
  children,
}: {
  label: string;
  value: string | number;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-1 flex flex-col items-center">
      <p className="text-sm text-neutral-400">{label}</p>
      <p className="text-lg font-bold">{value}</p>
      {children}
    </div>
  );
}
