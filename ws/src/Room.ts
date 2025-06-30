import { User } from "./User";
import { GRID_SIZE } from "./utils/constants";
import { Coin } from "./utils/types";

export class Room {
  public coins: Coin[] = [];
  public players: User[] = [];

  constructor(
    public status: "active" | "completed",
    public roomName: string,
    public roomId: string,
    public maxPlayers: number,
    public currentPlayers: number,
    public stakingAmount: number,
    public winningAmount: number,
    public interval: number,
    public wonUserId: string,
    public numOfCoins: number
  ) {
    this.generateCoins();
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
}
