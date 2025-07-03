import { WebSocket } from "ws";
import { OUTGOING_MESSAGE } from "./utils/types";

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
    this.x = 0;
    this.y = 0;
    this.coinsWon = 0;
  }
  sendMessage(message: OUTGOING_MESSAGE) {
    this.websocket.send(JSON.stringify(message));
  }
}
