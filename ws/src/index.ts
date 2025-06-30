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
        Manager.getInstance().createUser(parsedData.payload.userName, socket);
        break;
    }
  });
});
