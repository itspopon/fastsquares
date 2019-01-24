import * as Square from "./Square";

let previousSlot1Lives;
let previousSlot2Lives;

export const Player1 = pos => {
  document.querySelectorAll(".square.player").forEach(square => {
    square.classList.remove("player");
  });
  document.querySelectorAll("#player2-board .square.shadow").forEach(square => {
    square.classList.remove("shadow");
  });
  Square.at(pos.x, pos.y).classList.add("player");
  Square.enemyAt(pos.x, pos.y).classList.add("shadow");
};

export const Player2 = pos => {
  document.querySelectorAll(".square.enemy").forEach(square => {
    square.classList.remove("enemy");
  });
  document.querySelectorAll("#player1-board .square.shadow").forEach(square => {
    square.classList.remove("shadow");
  });
  Square.enemyAt(pos.x, pos.y).classList.add("enemy");
  Square.at(pos.x, pos.y).classList.add("shadow");
};

export const Obstacles = obstacles => {
  document.querySelectorAll(".square.obstacle").forEach(square => {
    square.classList.remove("obstacle");
  });
  obstacles.forEach(obstacle => {
    const position = { ...JSON.parse(obstacle) };
    Square.at(position.x, position.y).classList.add("obstacle");
    Square.enemyAt(position.x, position.y).classList.add("obstacle");
  });
};

export const Objective = objective => {
  document.querySelectorAll(".square.objective").forEach(square => {
    square.classList.remove("objective");
  });
  Square.at(objective.x, objective.y).classList.add("objective");
  Square.enemyAt(objective.x, objective.y).classList.add("objective");
};

export const UI = socket => {
  let username = socket.user.getUsername();
  document.querySelectorAll(".username").forEach(item => {
    item.textContent = username;
  });

  if (!socket.gameRoom) return;

  let online = socket.gameRoom.getOnline();
  let room = socket.user.getRoom();

  document.querySelectorAll(".room-num-users").forEach(item => {
    item.textContent = online;
  });
  document.querySelectorAll(".room").forEach(item => {
    item.textContent = room;
  });

  // Render leaderboard
  const lb = document.querySelector(".leaderboard .card-content");
  while (lb.firstChild) {
    lb.removeChild(lb.firstChild);
  }
  socket.gameRoom.getLeaderboardNamesAndScore().forEach((userScore, i) => {
    //console.log("UserScore:",userScore);

    let position = i + 1;
    let name = userScore.username;
    let score = userScore.score;

    let positionSpan = document.createElement("SPAN");
    positionSpan.textContent = position + ". ";
    positionSpan.className = "leaderboard-position";

    let nameSpan = document.createElement("SPAN");
    nameSpan.textContent = name + " ";
    nameSpan.className = "leaderboard-name";

    let scoreSpan = document.createElement("SPAN");
    scoreSpan.textContent = `(${score})`;
    scoreSpan.className = "leaderboard-score";

    let div = document.createElement("DIV");
    div.appendChild(positionSpan);
    div.appendChild(nameSpan);
    div.appendChild(scoreSpan);
    div.className = "leaderboard-item";

    document.querySelector(".leaderboard .card-content").appendChild(div);
  });

  // Render queue
  const qu = document.querySelector(".queue .card-content");
  while (qu.firstChild) {
    qu.removeChild(qu.firstChild);
  }
  socket.gameRoom.getQueueNamesAndPosition().forEach((userInQueue, i) => {
    //console.log("userInQueue:",userInQueue);

    if (
      userInQueue.id === socket.gameRoom.player1.id ||
      userInQueue.id === socket.gameRoom.player2.id
    ) {
      return;
    }

    let name = userInQueue.username;

    let nameSpan = document.createElement("SPAN");
    nameSpan.textContent = name + " ";
    nameSpan.className = "leaderboard-name";

    let div = document.createElement("DIV");
    div.appendChild(nameSpan);
    div.className = "leaderboard-item";

    document.querySelector(".queue .card-content").appendChild(div);
  });

  document.querySelectorAll(".slot1-name").forEach(item => {
    item.textContent = socket.gameRoom.userList.find(
      u => u.id === socket.gameRoom.player1.id
    ).username;
  });
  document.querySelectorAll(".slot1-lives").forEach(item => {
    item.textContent = socket.gameRoom.player1.lives + "💖";
    if (previousSlot1Lives !== socket.gameRoom.player1.lives) {
      item.classList.add("animated");
      item.classList.add("bounceIn");
      item.classList.add("fastest");
      setTimeout(() => {
        item.classList.remove("animated");
        item.classList.remove("bounceIn");
        item.classList.remove("fastest");
      }, 150);
      previousSlot1Lives = socket.gameRoom.player1.lives;
    }
  });
  try {
    document.querySelectorAll(".slot2-name").forEach(item => {
      item.textContent = socket.gameRoom.userList.find(
        u => u.id === socket.gameRoom.player2.id
      ).username;
    });
    document.querySelectorAll(".slot2-lives").forEach(item => {
      item.textContent = socket.gameRoom.player2.lives + "💖";
      if (previousSlot2Lives !== socket.gameRoom.player2.lives) {
        item.classList.add("animated");
        item.classList.add("bounceIn");
        item.classList.add("fastest");
        setTimeout(() => {
          item.classList.remove("animated");
          item.classList.remove("bounceIn");
          item.classList.remove("fastest");
        }, 150);
        previousSlot2Lives = socket.gameRoom.player2.lives;
      }
    });
  } catch (e) {
    console.log("Tried to render slot2 UI info. But p2 not found.");
  }
};

export const All = socket => {
  Player1(socket.gameRoom.getPlayerPos(1));
  Player2(socket.gameRoom.getPlayerPos(2));
  Obstacles(socket.gameRoom.getObstacles());
  Objective(socket.gameRoom.getObjective());
  UI(socket);
};
