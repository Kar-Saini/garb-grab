import { WebSocketServer } from "ws";

const server = new WebSocketServer({ port: 8080 });

server.on("connection", (socket) => {
  console.log("User connected");
  socket.send(JSON.stringify({ msg: "Hello" }));
});
