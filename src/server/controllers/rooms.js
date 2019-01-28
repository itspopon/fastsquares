const Room = require("../models/room");

const UserList = require("../util/UserList");

exports.createRoom = (socket, rooms) => {
  socket.on("create room", data => {
    console.log("Create room:", data);
    let userInfo = socket.userInfo;
    if (userInfo.room !== "") {
      console.log("Room aint empty", userInfo);
      return;
    }
    if (Room.isInvalidCreationName(data.room, rooms)) {
      socket.emit("invalid", Room.isInvalidCreationName(data.room, rooms));
      console.log("invalid room name");
      return;
    }

    socket.userInfo.setType("player");
    rooms.set(data.room, new Room(data.room, socket.userInfo));
    //console.log("Room object created:", rooms.get(data.room));
    let createdRoom = rooms.get(data.room);
    socket.userInfo.setRoom(data.room);
    socket.join(data.room);

    //console.log("Emitted objective was: ", createdRoom.objective, typeof createdRoom.objective);
    console.log("Emitting room created socket");
    socket.emit("room created", {
      room: data.room,
      online: 1,
      type: "player",
      obstacles: createdRoom.getObstaclesAsArray(),
      objective: { ...createdRoom.objective },
      userList: UserList.getUserListThatClientCanUnderstand(createdRoom.userList)
    });
    // console.log("Room created:", data.room, userInfo.getUsername());
  });
};

exports.enterRoom = (socket, rooms) => {
  socket.on("enter room", data => {
    let userInfo = socket.userInfo;
    if (userInfo.room !== "") return;
    let room = rooms.get(data.roomName);
    if (Room.isInvalidEnteringName(data.roomName, rooms)) {
      socket.emit("invalid", Room.isInvalidEnteringName(data.roomName, rooms));
      return;
    }

    if (room.player1.id === "") {
      socket.userInfo.setPosition(
        room.player1.position.x,
        room.player1.position.y
      );
      room.setPlayer(1, socket.userInfo);
      socket.userInfo.setType("player1");
    }
    if (room.player2.id === "") {
      socket.userInfo.setPosition(
        room.player2.position.x,
        room.player2.position.y
      );
      room.setPlayer(2, socket.userInfo);
      socket.userInfo.setType("player2");
    }
    if (room.player1.id !== socket.id && room.player2.id !== socket.id) {
      console.log(
        "Setting spectator(" + socket.id + "): ",
        socket.userInfo.getType()
      );
      console.log("P1:", room.player1.id, "P2:", room.player2.id);
      socket.userInfo.setType("spectator");
    }
    socket.userInfo.queue = room.getOnline();
    room.userList.set(socket.id, socket.userInfo);
    socket.userInfo.setRoom(data.roomName);
    //rooms.set(data.roomName, currentRoom);

    let initialData = {
      room: socket.userInfo.getRoom(),
      owner: {
        id: room.owner.id,
        username: room.owner.username
      },
      online: room.getOnline(),
      slot: socket.userInfo.getType(),
      obstacles: room.getObstaclesAsObjectsArray(),
      objective: room.objective,
      player1: room.player1,
      player2: room.player2,
      userList: UserList.getUserListThatClientCanUnderstand(room.userList)
    };

    // initialize this client
    socket.emit("entering room", initialData);

    // broadcast new user
    socket.join(userInfo.getRoom());
    socket.to(userInfo.getRoom()).emit("user joined", {
      username: userInfo.getUsername(),
      online: room.getOnline(),
      user: UserList.getUserListThatClientCanUnderstand(room.userList).find(
        u => u.id === socket.id
      )
    });
    // console.log("User joined a room:", socket.userInfo);
  });
};

exports.leaveRoom = (socket, rooms) => {
  socket.on("leave room", data => {
    let userInfo = socket.userInfo;
    let room = rooms.get(userInfo.getRoom());
    if (!room) {
      socket.emit("disconnect", "BEGONE!");
    }
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
          console.log(queuePositions);
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
          console.log(queuePositions);
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
    }
    socket.leave(userInfo.room);
    socket.userInfo.reset();
  });
};
