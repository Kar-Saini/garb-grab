"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coin, Player } from "@/lib/types";
import { COIN_SPAWN_INTERVAL, GRID_SIZE } from "@/lib/constants";

export default function Component() {
  const [players, setPlayers] = useState<Player[]>([
    {
      id: 1,
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
      score: 0,
      color: "bg-blue-500",
      name: "Player 1",
      keys: { up: "w", down: "s", left: "a", right: "d" },
    },
    {
      id: 2,
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
      score: 0,
      color: "bg-red-500",
      name: "Player 2",
      keys: {
        up: "ArrowUp",
        down: "ArrowDown",
        left: "ArrowLeft",
        right: "ArrowRight",
      },
    },
  ]);

  const [coins, setCoins] = useState<Coin[]>([]);
  const [gameActive, setGameActive] = useState(false);
  const [nextCoinIn, setNextCoinIn] = useState(0);

  const spawnCoin = useCallback(() => {
    const newCoin: Coin = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
      id: Date.now(),
    };
    setCoins((prev) => [...prev, newCoin]);
  }, []);

  const movePlayer = useCallback(
    (playerId: number, dx: number, dy: number) => {
      if (!gameActive) return;

      setPlayers((prev) =>
        prev.map((player) => {
          if (player.id === playerId) {
            const newX = Math.max(0, Math.min(GRID_SIZE - 1, player.x + dx));
            const newY = Math.max(0, Math.min(GRID_SIZE - 1, player.y + dy));
            return { ...player, x: newX, y: newY };
          }
          return player;
        })
      );
    },
    [gameActive]
  );

  const checkCoinCollection = useCallback(() => {
    setCoins((prevCoins) => {
      const remainingCoins = prevCoins.filter((coin) => {
        const collector = players.find(
          (player) => player.x === coin.x && player.y === coin.y
        );
        if (collector) {
          setPlayers((prevPlayers) =>
            prevPlayers.map((player) =>
              player.id === collector.id
                ? { ...player, score: player.score + 1 }
                : player
            )
          );
          return false;
        }
        return true;
      });
      return remainingCoins;
    });
  }, [players]);

  useEffect(() => {
    checkCoinCollection();
  }, [players, checkCoinCollection]);

  useEffect(() => {
    if (!gameActive) return;

    const coinTimer = setInterval(() => {
      spawnCoin();
      setNextCoinIn(COIN_SPAWN_INTERVAL);
    }, COIN_SPAWN_INTERVAL);

    const countdownTimer = setInterval(() => {
      setNextCoinIn((prev) => Math.max(0, prev - 100));
    }, 100);

    spawnCoin();
    setNextCoinIn(COIN_SPAWN_INTERVAL);

    return () => {
      clearInterval(coinTimer);
      clearInterval(countdownTimer);
    };
  }, [gameActive, spawnCoin]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameActive) return;

      players.forEach((player) => {
        switch (e.key.toLowerCase()) {
          case player.keys.up.toLowerCase():
            movePlayer(player.id, 0, -1);
            break;
          case player.keys.down.toLowerCase():
            movePlayer(player.id, 0, 1);
            break;
          case player.keys.left.toLowerCase():
            movePlayer(player.id, -1, 0);
            break;
          case player.keys.right.toLowerCase():
            movePlayer(player.id, 1, 0);
            break;
        }
      });
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [players, movePlayer, gameActive]);

  const startGame = () => {
    setGameActive(true);
    setPlayers((prev) =>
      prev.map((player) => ({
        ...player,
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
        score: 0,
      }))
    );
    setCoins([]);
  };

  const stopGame = () => {
    setGameActive(false);
    setCoins([]);
    setNextCoinIn(0);
  };

  const addPlayer = () => {
    const colors = [
      "bg-green-500",
      "bg-purple-500",
      "bg-yellow-500",
      "bg-pink-500",
    ];
    const newPlayer: Player = {
      id: players.length + 1,
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
      score: 0,
      color: colors[players.length % colors.length],
      name: `Player ${players.length + 1}`,
      keys: { up: "i", down: "k", left: "j", right: "l" },
    };
    setPlayers((prev) => [...prev, newPlayer]);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-background min-h-screen">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Coin Collection Race
          </CardTitle>
          <div className="flex justify-center gap-4">
            {!gameActive ? (
              <Button onClick={startGame}>Start Game</Button>
            ) : (
              <Button onClick={stopGame} variant="destructive">
                Stop Game
              </Button>
            )}
            {!gameActive && players.length < 4 && (
              <Button onClick={addPlayer} variant="outline">
                Add Player
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4">
              {players.map((player) => (
                <Badge key={player.id} variant="secondary" className="text-sm">
                  <div
                    className={`w-3 h-3 rounded-full ${player.color} mr-2`}
                  ></div>
                  {player.name}: {player.score}
                </Badge>
              ))}
            </div>
            {gameActive && (
              <Badge variant="outline">
                Next coin in: {Math.ceil(nextCoinIn / 1000)}s
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-10 gap-1 bg-gray-100 p-4 rounded-lg mx-auto w-fit">
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);

              const playersHere = players.filter(
                (player) => player.x === x && player.y === y
              );
              const coinHere = coins.find(
                (coin) => coin.x === x && coin.y === y
              );

              return (
                <div
                  key={index}
                  className="w-8 h-8 bg-white border border-gray-200 rounded flex items-center justify-center relative"
                >
                  {coinHere && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-yellow-600 flex items-center justify-center text-xs font-bold animate-pulse">
                        $
                      </div>
                    </div>
                  )}
                  {playersHere.map((player, idx) => (
                    <div
                      key={player.id}
                      className={`w-5 h-5 ${player.color} rounded-full border-2 border-white absolute`}
                      style={{
                        transform: `translate(${idx * 2}px, ${idx * 2}px)`,
                        zIndex: 10 + idx,
                      }}
                    />
                  ))}
                </div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            {players.map((player) => (
              <div key={player.id} className="flex items-center gap-2">
                <div className={`w-4 h-4 ${player.color} rounded-full`}></div>
                <span className="font-medium">{player.name}:</span>
                <span>
                  {player.keys.up.toUpperCase()}/
                  {player.keys.left.toUpperCase()}/
                  {player.keys.down.toUpperCase()}/
                  {player.keys.right.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          {!gameActive && (
            <div className="text-center mt-4 text-muted-foreground">
              <p>Click "Start Game" to begin!</p>
              <p className="text-xs mt-2">
                Players spawn at random positions. Collect coins to score
                points!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
