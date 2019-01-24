var app = require("express")();
var express = require("express");
var path = require("path");
var server = require("http").Server(app);
var io = require("socket.io")(server);
var port = process.env.PORT || 3000;

const ChatController = require("./src/server/controllers/chat");
const UserController = require("./src/server/controllers/user");
const RoomsController = require("./src/server/controllers/rooms");
const GameController = require("./src/server/controllers/game");

app.use(express.static(path.join(__dirname, "public")));

let rooms = new Map();
setInterval(() => console.log("Rooms online: ", rooms.size), 5 * 60 * 1000);

io.on("connection", function(socket) {
  socket.userInfo = {};
  /* User */
  UserController.login(socket);
  UserController.disconnect(socket, rooms);

  /* Chat */
  ChatController.chatMessage(socket, rooms);

  /* Room */
  RoomsController.createRoom(socket, rooms);

  RoomsController.enterRoom(socket, rooms);

  RoomsController.leaveRoom(socket, rooms);

  /* GAME */
  GameController.movePlayer(socket, rooms);
});

server.listen(port, function() {
  console.log("listening on *:3000");
});
