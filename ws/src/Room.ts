import { Manager } from "./Manager";
import { User } from "./User";
import { GRID_SIZE } from "./utils/constants";
import { Coin, OUTGOING_MESSAGE } from "./utils/types";

export class Room {
  public coins: Coin[] = [];
  public players: User[] = [];

  constructor(
    public status: "active" | "completed",
    public adminId: string,
    public roomId: string,
    public maxPlayers: number,
    public currentPlayers: number,
    public stakingAmount: number,
    public winningAmount: number,
    public numOfCoins: number,
    public wonUserId: string | null
  ) {
    this.generateCoins();
    this.currentPlayers = 0;
  }

  generateCoins() {
    for (let i = 1; i < this.numOfCoins + 1; i++) {
      const coin = {
        id: i,
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      this.coins.push(coin);
    }
  }
  addUser(userId: string) {
    if (this.players.length < this.maxPlayers) {
      const user = Manager.getInstance().getUser(userId);
      if (user) {
        this.players.push(user);
        this.currentPlayers = this.players.length;
      }
      this.broadCast({
        type: "user-joined-room",
        payload: {
          roomId: this.roomId,
          adminId: this.adminId,
          maxPlayer: this.maxPlayers,
          currentPlayers: this.players.map(
            ({ coinsWon, x, y, userId, userName, avatar }) => ({
              coinsWon,
              x,
              y,
              userId,
              userName,
              avatar,
            })
          ),
          stakeAmount: this.stakingAmount,
          winAmount: this.winningAmount,
          numOfCoins: this.numOfCoins,
        },
      });
    }
  }
  broadCast(message: OUTGOING_MESSAGE) {
    this.players.forEach((user) => {
      user.websocket.send(JSON.stringify(message));
    });
  }
  broadCastExcept(userId: string, message: OUTGOING_MESSAGE) {
    this.players.map((user) => {
      if (user.userId !== userId) user.websocket.send(JSON.stringify(message));
    });
  }
  movePlayer(playerId: string, newX: number, newY: number) {
    const player = this.players.find((p) => p.userId === playerId);
    if (player) {
      player.x = newX;
      player.y = newY;
    }

    this.broadCastExcept(playerId, {
      type: "player-moved",
      payload: { playerId, newX, newY },
    });
  }
  startGame() {
    this.status = "active";
    this.broadCast({ type: "game-started", payload: { coins: this.coins } });
  }
}
