const Room = require("../models/room");

const Positions = require("../util/Positions");

exports.movePlayer = (socket, rooms) => {
  socket.on("move player", data => {
    let userInfo = socket.userInfo;
    if (!userInfo.getRoom()) return;
    let room = rooms.get(userInfo.getRoom());
    let { player1, player2 } = room;
    // if user is not playing, ignore
    if (!(player1.id === socket.id || player2.id === socket.id)) {
      // Client desynced from server. Lets mercy kill it.
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
      // socket.emit("mercy kill");
      console.log(
        "received movement from not a player",
        userInfo.getUsername()
      );
      console.log("disconnecting user!;");
      return;
    }

    let x, y;
    if (player1.id === socket.id) {
      x = player1.position.x;
      y = player1.position.y;
    }
    if (player2.id === socket.id) {
      x = player2.position.x;
      y = player2.position.y;
    }
    const { pX, pY } = data;
    const newPos = { x: pX + x, y: pY + y };

    // check for obstacles
    hasObstacle = room.obstacles.has(
      JSON.stringify({ x: newPos.x, y: newPos.y })
    );
    if (hasObstacle) {
      // Client desynced from server. Lets mercy kill it.
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
      // TODO: socket.emit("mercy kill");
      console.log(
        "Error: Invalid movement for player: " + userInfo.getUsername()
      );
      return;
    }

    // save new position
    socket.userInfo.setPosition(newPos.x, newPos.y);
    userInfo = socket.userInfo;

    let who;

    if (room.player1.id === socket.id) {
      who = 1;
      room.player1.position = { ...userInfo.getPosition() };
    } else {
      who = 2;
      room.player2.position = { ...userInfo.getPosition() };
    }

    socket
      .to(userInfo.getRoom())
      .emit("player moved", { ...userInfo.getPosition(), who: who });

    // check if its the objective position
    /*console.log(
      `Player ${who} position: ${userInfo.getPosition().x},${
        userInfo.getPosition().y
      } Objective: ${objectivePos.x},${objectivePos.y}`
      );*/
    const objectivePos = room.objective;
    if (Positions.isSamePosition(userInfo.getPosition(), objectivePos)) {
      socket.userInfo.scoreUp(socket.id);

      room.userList.set(socket.id, socket.userInfo);
      let obstacleData = Room.getNewObstaclesPositions(room);
      obstacleData.obstacles
        .map(item => JSON.stringify(item))
        .forEach(item => room.obstacles.add(item));

      sendingData = { ...obstacleData, whoId: socket.id };
      socket.emit("objective collected", sendingData);
      socket.to(userInfo.getRoom()).emit("objective collected", sendingData);
      if (who === 1) {
        room.player2.lives -= 1;
        console.log("Player 2 lost a life and now has ", room.player2.lives);
        if (room.player2.lives <= 0) {
          if (room.getOnline() <= 2) return;
          socket.to(userInfo.getRoom()).emit("out of lives", { who: 2 });
          socket.emit("out of lives", { who: 2 });
          let loserId = room.player2.id;
          room.userList.forEach((u, uId) => {
            if (uId === room.player1.id) return;
            if (uId === loserId) {
              u.queue = room.getOnline();
              return;
            }
            u.queue -= 1;
          });
          let queuePositions = room.getQueueIdsAndPosition();
          console.log(queuePositions);
          let ignorePlayer1 = queuePositions.findIndex(
            u => u.id === room.player1.id
          );
          queuePositions.splice(ignorePlayer1, 1);
          //console.log("Next in queue:", room.userList.get(queuePositions[0].id));
          room.setPlayer(2, room.userList.get(queuePositions[0].id));
        }
      } else {
        room.player1.lives -= 1;
        console.log("Player 1 lost a life and now has", room.player1.lives);
        if (room.player1.lives <= 0) {
          if (room.getOnline() <= 2) return;
          socket.to(userInfo.getRoom()).emit("out of lives", { who: 1 });
          socket.emit("out of lives", { who: 1 });
          let loserId = room.player1.id;
          room.userList.forEach((u, uId) => {
            if (uId === room.player2.id) return;
            if (uId === loserId) {
              u.queue = room.getOnline();
              return;
            }
            u.queue -= 1;
          });
          let queuePositions = room.getQueueIdsAndPosition();
          let ignorePlayer2 = queuePositions.findIndex(
            u => u.id === room.player2.id
          );
          queuePositions.splice(ignorePlayer2, 1);
          console.log(
            "Next in queue:",
            room.userList.get(queuePositions[0].id)
          );
          room.setPlayer(1, room.userList.get(queuePositions[0].id));
        }
      }
    }
  });
};
