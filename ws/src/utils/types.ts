export type Coin = {
  x: number;
  y: number;
  id: number;
};

export type INCOMMING_MESSAGE =
  | { type: "user-join-lobby"; payload: { userName: string; avatar: string } }
  | {
      type: "create-room";
      payload: {
        adminId: string;
        userId: string;
        userName: string;
        stake: number;
        maxPlayers: number;
      };
    }
  | { type: "join-room"; payload: { roomId: string; userId: string } }
  | {
      type: "player-move";
      payload: { roomId: string; playerId: string; newX: number; newY: number };
    };

export type OUTGOING_MESSAGE =
  | {
      type: "user-joined-lobby";
      payload: { userName: string; userId: string; avatar: string };
    }
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

type User = {
  x: number;
  y: number;
  coinsWon: number;
  userId: string;
  userName: string;
  avatar: string;
};
