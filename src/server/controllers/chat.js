const Room = require("../models/room");

const knownCommands = new Set(["stuck"]);

exports.chatMessage = (socket, rooms) => {
  socket.on("chat message", msg => {
    let room = rooms.get(socket.userInfo.getRoom());
    let userInfo = socket.userInfo;
    if (msg.message[0] === "/") {
      let command = msg.message
        .split("")
        .splice(1, msg.message.length)
        .join("");
      if (knownCommands.has(command)) {
        // command logic
        if (command === "stuck") {
          if (
            room.owner.id !==
            socket.userInfo.id
          ) {
            socket.emit("new message", {
              username: "@",
              message: "Only the room's owner can use /stuck"
            });
          } else {
            // stuck logic
            let obstacleData = Room.getNewObstaclesPositions(room);
            obstacleData.obstacles
              .map(item => JSON.stringify(item))
              .forEach(item => room.obstacles.add(item));

            sendingData = { ...obstacleData, whoId: socket.id, stuck: true };
            socket.emit("objective collected", sendingData);
            socket
              .to(userInfo.getRoom())
              .emit("objective collected", sendingData);
          }
        }
      } else {
        socket.emit("new message", {
          username: "@",
          message: `Command "${command}" not found.`
        });
      }
    } else {
      socket.to(socket.userInfo.getRoom()).emit("new message", msg);
    }
  });
};
