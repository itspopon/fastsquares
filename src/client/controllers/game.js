import * as Square from "../util/Square";
import * as Render from "../util/Render";
import * as Chat from "../util/Chat";

import GameRoom from "../models/gameRoom";

// TODO: reset p1 p2 positions in server and client if room is deleted
// TODO: if exiting room in client, get updated positions from server when rejoininng
const movePlayer = (pX, pY, socket) => {
  // current player position
  let x, y, slot;
  slot = socket.user.getSlot();
  let playerSlot;
  if (slot === "player1") {
    x = socket.gameRoom.getPlayerPos(1).x;
    y = socket.gameRoom.getPlayerPos(1).y;
    playerSlot = 1;
  } else if (slot === "player2") {
    x = socket.gameRoom.getPlayerPos(2).x;
    y = socket.gameRoom.getPlayerPos(2).y;
    playerSlot = 2;
  } else {
    return;
  }
  if (socket.gameRoom.player1.id === "" || socket.gameRoom.player2.id === "") {
    return;
  }
  const newPos = { x: pX + x, y: pY + y };
  //console.log("NewPos for", socket.user.getSlot(), `{x:${x} + ${pX}, y: ${y} + ${pY}}`);

  // check for obstacles
  if (Square.hasObstacle(newPos.x, newPos.y, socket.gameRoom.getObstacles()))
    return;

  // save new position
  socket.gameRoom.setPlayerPos(playerSlot, newPos.x, newPos.y);

  // socket logic here (emit "move player" {pX, pY}) repeat logic on server for validation
  socket.emit("move player", { pX, pY });

  if (slot === "player1") {
    Render.Player1(newPos);
  } else {
    Render.Player2(newPos);
  }
};

export const playerMoved = socket => {
  socket.on("player moved", data => {
    if (data.who === 1) {
      socket.gameRoom.setPlayerPos(1, data.x, data.y);
      Render.Player1(socket.gameRoom.getPlayerPos(1));
      return;
    } else {
      socket.gameRoom.setPlayerPos(2, data.x, data.y);
      Render.Player2(socket.gameRoom.getPlayerPos(2));
      return;
    }
  });
};

export const objectiveCollected = socket => {
  socket.on("objective collected", data => {
    socket.gameRoom.setObjective(data.objective.x, data.objective.y);
    socket.gameRoom.setObstacles(
      data.obstacles.map(item => JSON.stringify(item))
    );
    if (!data.stuck) socket.gameRoom.scoreUp(data.whoId);
    Render.UI(socket);
    Render.Obstacles(socket.gameRoom.getObstacles());
    Render.Objective(socket.gameRoom.getObjective());
  });
};

export const playerMovement = socket => {
  document.body.addEventListener("keydown", e => {
    const key = e.code;
    let room = socket.user.getRoom();
    let slot = socket.user.getSlot();
    // If the user press Esc with the chat selected, blur the chat and return
    if (e.target.id === "m" && key === "Escape") {
      e.target.blur();
      return;
    }
    // If the user press Enter without the chat selected, focus the chat and return
    if (e.target.id !== "m" && key === "Enter" && room !== "") {
      e.preventDefault();
      document.querySelector("#m").focus();
      return false;
    }

    if (
      room === "" ||
      (slot === "" || slot === "spectator") ||
      e.target.id === "m"
    ) {
      //console.log("Failed movement attempt:", room, slot);
      return;
    }
    let x, y;
    if (slot === "player1") {
      x = socket.gameRoom.getPlayerPos(1).x;
      y = socket.gameRoom.getPlayerPos(1).y;
    } else {
      x = socket.gameRoom.getPlayerPos(2).x;
      y = socket.gameRoom.getPlayerPos(2).y;
    }
    if ((key === "KeyW" || key === "ArrowUp") && y !== 0) {
      movePlayer(0, -1, socket);
    }
    if ((key === "KeyD" || key === "ArrowRight") && x !== 4) {
      movePlayer(1, 0, socket);
    }
    if ((key === "KeyS" || key === "ArrowDown") && y !== 4) {
      movePlayer(0, 1, socket);
    }
    if ((key === "KeyA" || key === "ArrowLeft") && x !== 0) {
      movePlayer(-1, 0, socket);
    }
  });
};

export const roomCreated = socket => {
  socket.on("room created", data => {
    $("#room-screen").hide();

    socket.gameRoom = new GameRoom(
      data.room,
      true,
      {
        id: socket.id,
        username: socket.user.getUsername(),
        score: data.score,
        queue: 0
      },
      "",
      data.obstacles,
      data.objective
    );
    socket.user.setRoom(data.room);
    socket.user.setSlot(1);

    Chat.addMessage("@", `You created the room ${data.room}.`, false, socket);

    Render.All(socket);
  });
};

export const enteringRoom = socket => {
  socket.on("entering room", data => {
    $("#room-screen").hide();

    console.log("Entering room data: ", data);
    socket.gameRoom = new GameRoom(
      data.room,
      true,
      data.owner,
      "",
      "",
      data.objective
    );
    let slot;
    if (data.slot === "player1") slot = 1;
    if (data.slot === "player2") slot = 2;
    if (data.slot === "spectator") slot = 3;
    socket.user.setRoom(data.room);
    socket.user.setSlot(slot);
    socket.gameRoom.setObstacles(
      new Set(data.obstacles.map(item => JSON.stringify(item)))
    );

    socket.gameRoom.userList = data.userList;
    console.log("Entering Room. UserList set to:", socket.gameRoom.userList);

    socket.gameRoom.initPlayers(data.player1, data.player2);

    Chat.addMessage(
      "@",
      `${socket.user.getUsername()} joined the room.`,
      false,
      socket
    );
    Render.All(socket);
  });
};
