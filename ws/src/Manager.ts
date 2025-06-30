import { WebSocket } from "ws";
import { Room } from "./Room";
import { User } from "./User";

export class Manager {
  private static instance: Manager;
  public users: User[];
  public rooms: Room[];
  private constructor() {
    this.rooms = [];
    this.users = [];
  }

  public static getInstance() {
    if (!Manager.instance) {
      Manager.instance = new Manager();
    }
    return Manager.instance;
  }

  createUser(userName: string, socket: WebSocket) {
    const userId = Math.floor(Math.random() * 1000000).toString();
    const user = new User(userId, userName, socket);
    user.sendMessage({
      type: "user-joined-lobby",
      payload: { userId, userName },
    });
  }
}
