import { AccountInfo } from "@solana/web3.js";

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
  | { type: ""; payload: {} }
  | { type: ""; payload: {} }
  | { type: ""; payload: {} }
  | { type: ""; payload: {} }
  | { type: ""; payload: {} };

export type OUTGOING_MESSAGE =
  | { type: "user-join-lobby"; payload: { userName: string } }
  | { type: ""; payload: {} }
  | { type: ""; payload: {} }
  | { type: ""; payload: {} }
  | { type: ""; payload: {} }
  | { type: ""; payload: {} };

export type UserAccountInfo = AccountInfo<Buffer> & {
  userId?: string;
  userName?: string;
};
