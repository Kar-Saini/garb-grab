import { WebSocket } from "ws";
import { OUTGOING_MESSAGE } from "./utils/types";
import { GRID_SIZE } from "./utils/constants";

export class User {
  public x: number;
  public y: number;
  public coinsWon: number;
  constructor(
    public userId: string,
    public userName: string,
    public websocket: WebSocket,
    public avatar: string
  ) {
    this.x = Math.floor(Math.random() * GRID_SIZE);
    this.y = Math.floor(Math.random() * GRID_SIZE);
    this.coinsWon = 0;
  }
  sendMessage(message: OUTGOING_MESSAGE) {
    this.websocket.send(JSON.stringify(message));
  }
}
