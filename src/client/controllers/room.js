import * as Chat from "../util/Chat";
import * as Render from "../util/Render";

export const outOfLives = socket => {
  socket.on("out of lives", data => {
    console.log(data);
    let room = socket.gameRoom;
    if (data.who === 1) {
      let loserId = room.player1.id;
      if (loserId === socket.id) {
        socket.user.setSlot(3);
        console.log("I am loser");
      }
      room.userList.forEach(u => {
        if (u.id === room.player2.id) return;
        if (u.id === loserId) {
          u.queue = room.getOnline();
          u.slot = "spectator";
          return;
        }
        u.queue -= 1;
      });
      let queuePositions = room.getQueueIdsAndPosition();
      let ignorePlayer2 = queuePositions.findIndex(
        u => u.id === room.player2.id
      );
      queuePositions.splice(ignorePlayer2, 1);
      console.log("Updated queuePositions: ", queuePositions);
      room.setPlayer(1, room.userList.find(u => u.id === queuePositions[0].id));
      if (queuePositions[0].id === socket.id) {
        socket.user.setSlot(1);
      }
    }
    if (data.who === 2) {
      let loserId = room.player2.id;
      if (loserId === socket.id) {
        socket.user.setSlot(3);
        console.log("I am loser");
      }
      room.userList.forEach(u => {
        if (u.id === room.player1.id) return;
        if (u.id === loserId) {
          u.queue = room.getOnline();
          return;
        }
        u.queue -= 1;
      });
      let queuePositions = room.getQueueIdsAndPosition();
      let ignorePlayer1 = queuePositions.findIndex(
        u => u.id === room.player1.id
      );
      queuePositions.splice(ignorePlayer1, 1);
      console.log("Updated queuePositions: ", queuePositions);
      room.setPlayer(2, room.userList.find(u => u.id === queuePositions[0].id));
      if (queuePositions[0].id === socket.id) {
        socket.user.setSlot(2);
      }
    }
    Render.UI(socket);
    console.log("P1", socket.gameRoom.player1);
    console.log("P2", socket.gameRoom.player2);
    console.log("UserList", socket.gameRoom.userList);
    console.log("socket.user", socket.user);
  });
};

export const onUserJoined = socket => {
  socket.on("user joined", data => {
    Chat.addMessage("@", `${data.username} joined the room.`, false, socket);
    socket.gameRoom.addUser(data.user);
    if (
      socket.gameRoom.getOnline() === 2 &&
      socket.gameRoom.player2.id !== socket.id
    ) {
      socket.gameRoom.player2.id = data.user.id;
    }
    console.log(
      "An user joined. The current userList now is:",
      socket.gameRoom.userList
    );
    console.log(
      "And p1, p2 is:",
      socket.gameRoom.player1,
      socket.gameRoom.player2
    );
    Render.UI(socket);
  });
};

export const onUserLeft = socket => {
  socket.on("user left", data => {
    Chat.addMessage("@", `${data.username} left the room.`, false, socket);
    console.log(
      "An user left. The current userList now is:",
      [...socket.gameRoom.userList]
    );
    console.log(
      "And p1, p2 is:",
      socket.gameRoom.player1,
      socket.gameRoom.player2
    );
    let room = socket.gameRoom;
    if (data.id === socket.gameRoom.player1.id && !(room.getOnline() <= 2)) {
      room.userList.forEach(u => {
        if (u.id === room.player2.id) return;
        u.queue -= 1;
      });
      let queuePositions = room.getQueueIdsAndPosition();
      let ignorePlayer2 = queuePositions.findIndex(
        u => u.id === room.player2.id
      );
      //console.log("Pre splice queuePositions: ", [...queuePositions]);
      queuePositions.splice(ignorePlayer2, 1);
      let ignoreLeavingPerson = queuePositions.findIndex(u => {
        //console.log("uid dataid",u.id,data.id);
        //if (u.id === data.id) console.log("ignoreLeavingPerson = ", u.username);
        return u.id === data.id;
      });
      queuePositions.splice(ignoreLeavingPerson, 1);
      //console.log("Updated queuePositions: ", queuePositions);
      room.setPlayer(1, room.userList.find(u => u.id === queuePositions[0].id));
      if (queuePositions[0].id === socket.id) {
        socket.user.setSlot(1);
      }
    }
    if (data.id === socket.gameRoom.player2.id && !(room.getOnline() <= 2)) {
      room.userList.forEach(u => {
        if (u.id === room.player1.id) return;
        u.queue -= 1;
      });
      let queuePositions = room.getQueueIdsAndPosition();
      let ignorePlayer1 = queuePositions.findIndex(
        u => u.id === room.player1.id
      );
      //console.log("Pre splice queuePositions: ", [...queuePositions]);
      queuePositions.splice(ignorePlayer1, 1);
      let ignoreLeavingPerson = queuePositions.findIndex(u => {
        //console.log("uid dataid",u.id,data.id);
        //if (u.id === data.id) console.log("ignoreLeavingPerson = ", u.username);
        return u.id === data.id;
      });
      queuePositions.splice(ignoreLeavingPerson, 1);
      //console.log("Updated queuePositions: ", queuePositions);
      room.setPlayer(2, room.userList.find(u => u.id === queuePositions[0].id));
      if (queuePositions[0].id === socket.id) {
        socket.user.setSlot(2);
      }
    }
    socket.gameRoom.removeUserById(data.id);
    Render.UI(socket);
  });
};
