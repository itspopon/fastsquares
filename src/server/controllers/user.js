const Input = require("../util/Input");
const UserList = require("../util/UserList");

const User = require("../models/user");

exports.login = (socket) => {
  socket.on("login", data => {
    if (Input.isValidInput(data.username)) {
      socket.userInfo = new User(socket.id, data.username);
      //console.log("New user created:", socket.userInfo);
    } else {
      socket.emit("invalid", { error: "invalid username" });
    }
  });
}

exports.disconnect = (socket, rooms) => {
  socket.on("disconnect", () => {
    if (!socket.userInfo.getRoom) return;
    let userInfo = socket.userInfo;
    let room = rooms.get(userInfo.getRoom());
    if (!room.getOnline) return;
    if (room.getOnline() === 1) {
      // if no one else left in the room, delete it
      rooms.delete(userInfo.getRoom());
      // console.log("Room deleted: ", userInfo.getRoom(), userInfo.getUsername());
    } else {
      // echo globally that this client has left
      socket.to(userInfo.room).emit("user left", {
        id: socket.id,
        username: userInfo.getUsername(),
        online: room.getOnline(),
        userList: UserList.getFullUserList(room.userList)
      });
      if (room.getOnline() > 2) {
        if (socket.id === room.player2.id) {
          room.userList.forEach((u, uId) => {
            if (uId === room.player1.id) return;
            u.queue -= 1;
          });
          let queuePositions = room.getQueueIdsAndPosition();
          console.log("queuePositions onDisconnect", queuePositions);
          let ignorePlayer1 = queuePositions.findIndex(
            u => u.id === room.player1.id
          );
          queuePositions.splice(ignorePlayer1, 1);
          let ignoreLeavingPerson = queuePositions.findIndex(
            u => u.id === socket.id
          );
          queuePositions.splice(ignoreLeavingPerson, 1);
          room.setPlayer(2, room.userList.get(queuePositions[0].id));
        }
        if (socket.id === room.player1.id) {
          room.userList.forEach((u, uId) => {
            if (uId === room.player2.id) return;
            u.queue -= 1;
          });
          let queuePositions = room.getQueueIdsAndPosition();
          console.log("queuePositions onDisconnect", queuePositions);
          let ignorePlayer2 = queuePositions.findIndex(
            u => u.id === room.player2.id
          );
          queuePositions.splice(ignorePlayer2, 1);
          let ignoreLeavingPerson = queuePositions.findIndex(
            u => u.id === socket.id
          );
          queuePositions.splice(ignoreLeavingPerson, 1);
          room.setPlayer(1, room.userList.get(queuePositions[0].id));
        }
      }
      room.userList.delete(socket.id);
      console.log("p1,p2",room.player1.username, room.player2.username);
    }
    socket.leave(userInfo.room);
    socket.userInfo.reset();
  });
}