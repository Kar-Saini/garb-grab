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

  createUser(userName: string, socket: WebSocket, avatar: string) {
    const userId = Math.floor(Math.random() * 1000000).toString();
    const user = new User(userId, userName, socket, avatar);
    this.users.push(user);
    user.sendMessage({
      type: "user-joined-lobby",
      payload: { userId, userName, avatar },
    });
  }
  createRoom(payload: {
    adminId: string;
    userId: string;
    userName: string;
    stake: number;
    maxPlayers: number;
  }) {
    const roomId = Math.floor(Math.random() * 100000000).toString();
    const numOfCoins = Math.floor(10 * (Math.random() + 1));
    const winAmount = 0.9 * 2 * payload.stake;
    const newRoom = new Room(
      "active",
      payload.adminId,
      roomId,
      payload.maxPlayers,
      0,
      payload.stake,
      winAmount,
      numOfCoins,
      null
    );
    this.rooms.push(newRoom);
    newRoom.addUser(payload.userId);
    newRoom.broadCast({
      type: "room-created",
      payload: {
        roomId,
        adminId: newRoom.adminId,
        maxPlayer: newRoom.maxPlayers,
        currentPlayers: newRoom.players.map(
          ({ coinsWon, x, y, userId, userName, avatar }) => ({
            coinsWon,
            x,
            y,
            userId,
            userName,
            avatar,
          })
        ),
        stakeAmount: newRoom.stakingAmount,
        winAmount: newRoom.winningAmount,
        numOfCoins: newRoom.numOfCoins,
      },
    });
  }
  getUser(userId: string) {
    const user = this.users.find((user) => user.userId === userId);
    if (user) return user;
  }

  getRoom(roomId: string) {
    const room = this.rooms.find((room) => room.roomId === roomId);
    if (room) return room;
  }

  joinRoom(roomId: string, userId: string) {
    const room = this.getRoom(roomId);
    const user = this.getUser(userId);
    if (room && user) {
      room.addUser(userId);
    }
  }
}
