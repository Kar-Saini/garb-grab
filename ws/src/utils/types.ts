export type Coin = {
  x: number;
  y: number;
  id: number;
};

export type INCOMMING_MESSAGE =
  | { type: "user-join-lobby"; payload: { userName: string } }
  | { type: ""; payload: {} }
  | { type: ""; payload: {} }
  | { type: ""; payload: {} }
  | { type: ""; payload: {} }
  | { type: ""; payload: {} };

export type OUTGOING_MESSAGE =
  | { type: "user-joined-lobby"; payload: { userName: string; userId: string } }
  | { type: ""; payload: {} }
  | { type: ""; payload: {} }
  | { type: ""; payload: {} }
  | { type: ""; payload: {} }
  | { type: ""; payload: {} };
