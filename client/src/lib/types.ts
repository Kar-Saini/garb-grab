import { AccountInfo } from "@solana/web3.js";
import { NavigateFunction } from "react-router-dom";

export interface Player {
  id: number;
  x: number;
  y: number;
  score: number;
  color: string;
  name: string;
  keys: {
    up: string;
    down: string;
    left: string;
    right: string;
  };
}

export interface Coin {
  x: number;
  y: number;
  id: number;
}

export type INCOMMING_MESSAGE =
  | { type: "user-joined-lobby"; payload: { userName: string; userId: string } }
  | {
      type: "room-created";
      payload: {
        roomId: string;
        adminId: string;
        maxPlayer: number;
        currentPlayers: User[];
        stakeAmount: number;
        winAmount: number;
        numOfCoins: number;
      };
    }
  | {
      type: "user-joined-room";
      payload: {
        roomId: string;
        adminId: string;
        maxPlayer: number;
        currentPlayers: User[];
        stakeAmount: number;
        winAmount: number;
        numOfCoins: number;
      };
    }
  | {
      type: "player-moved";
      payload: { playerId: string; newX: number; newY: number };
    };

export type OUTGOING_MESSAGE = {
  type: "user-join-lobby";
  payload: { userName: string };
};

export type UserAccountInfo = AccountInfo<Buffer> & {
  userId?: string;
  userName?: string;
};

export type User = {
  x: number;
  y: number;
  coinsWon: number;
  userId: string;
  avatar: string;
  userName: string;
};

export interface AppContextType {
  socket: WebSocket | null;
  userName: string | null;
  setUserName: (val: string) => void;
  accountInfo: UserAccountInfo | null;
  setAccountInfo: React.Dispatch<React.SetStateAction<UserAccountInfo | null>>;
  selectedAvatar: string | null;
  setSelectedAvatar: (val: string) => void;
  navigate: NavigateFunction;
  roomInformation: RoomInformationType | null;
  setRoomInformation: React.Dispatch<
    React.SetStateAction<RoomInformationType | null>
  >;
}
export interface RoomInformationType {
  adminId: string;
  currentPlayers: User[];
  roomId: string;
  maxPlayer: number;
  stakeAmount: number;
  winAmount: number;
  numOfCoins: number;
}
