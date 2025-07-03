import { WebSocketServer } from "ws";
import { INCOMMING_MESSAGE } from "./utils/types";
import { Manager } from "./Manager";

const server = new WebSocketServer({ port: 8080 });

server.on("connection", (socket) => {
  console.log("User connected");
  socket.send(JSON.stringify({ msg: "Hello" }));
  socket.on("message", (data) => {
    const parsedData: INCOMMING_MESSAGE = JSON.parse(data.toString());
    switch (parsedData.type) {
      case "user-join-lobby":
        Manager.getInstance().createUser(
          parsedData.payload.userName,
          socket,
          parsedData.payload.avatar
        );
        break;
      case "create-room":
        Manager.getInstance().createRoom(parsedData.payload);
        break;
      case "join-room":
        Manager.getInstance().joinRoom(
          parsedData.payload.roomId,
          parsedData.payload.userId
        );
        break;
      case "player-move":
        Manager.getInstance()
          .getRoom(parsedData.payload.roomId)
          ?.movePlayer(
            parsedData.payload.playerId,
            parsedData.payload.newX,
            parsedData.payload.newY
          );
    }
  });
});
