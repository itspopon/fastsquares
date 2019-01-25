let path = require("path");

let express = require("express");

let app = require("express")();
let server = require("http").Server(app);
let io = require("socket.io")(server);
let bodyparser = require("body-parser");

let port = process.env.PORT || 3000;

const gameRoutes = require("./routes/game");
const adminRoutes = require("./routes/admin");

const ChatController = require("./src/server/controllers/chat");
const UserController = require("./src/server/controllers/user");
const RoomsController = require("./src/server/controllers/rooms");
const GameController = require("./src/server/controllers/game");

app.set("view engine", "ejs");

app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(gameRoutes);

app.use((req, res) => {
  res.status(404);
  res.render("404", {route: req.path, inGame: false, pageTitle: "Page Not Found"});
});

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
  console.log("listening on port:", port);
});
