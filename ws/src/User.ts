import { WebSocket } from "ws";
import { OUTGOING_MESSAGE } from "./utils/types";

export class User {
  public initialX: number;
  public initialY: number;
  public coinsWon: number;
  constructor(
    public userId: string,
    public userName: string,
    public websocket: WebSocket
  ) {
    this.initialX = 0;
    this.initialY = 0;
    this.coinsWon = 0;
  }
  sendMessage(message: OUTGOING_MESSAGE) {
    this.websocket.send(JSON.stringify(message));
  }
}
