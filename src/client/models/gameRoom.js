export default class GameRoom {
  constructor(roomName, isPublic, owner, password, obstacles, objective) {
    /* Room */
    this.name = roomName;
    /* User List: Array of {
      id: String id,
      username: String username,
      score: Number score,
      queue: Number queueOrder
    }*/
    this.userList = [
      { id: owner.id, username: owner.username, score: 0, queue: 0 }
    ];
    this.owner = owner;
    this.isPublic = isPublic;
    this.password = password;

    /* Game */
    this.obstacles = obstacles;
    this.objective = objective;
    this.player1 = { id: owner.id, position: { x: 0, y: 0 }, lives: 5 };
    this.player2 = { id: "", position: { x: 0, y: 0 }, lives: 5 };
  }

  getOnline() {
    return this.userList.length;
  }

  addUser(user) {
    this.userList.push(user);
  }

  getUserById(id) {
    return this.userList.find(user => user.id === id);
  }

  removeUserById(id) {
    let indexToRemove = this.userList.findIndex(u => u.id === id);
    this.userList.splice(indexToRemove,1);
  }

  getLeaderboardUserList() {
    return Array.from(this.userList).sort((a, b) => a.score - b.score);
  }

  getLeaderboardNames() {
    return Array.from(this.userList)
      .sort((a, b) => a.score - b.score)
      .map(user => user.username);
  }

  getLeaderboardNamesAndScore() {
    let userList = Array.from(this.userList);
    userList.sort((a, b) => b.score - a.score);

    return userList.map(userInList => {
      //console.log({ username: userInList.username, score: userInList.score });
      return { username: userInList.username, score: userInList.score };
    });
  }

  scoreUp(whoId) {
    //console.log("Score Up UserList: ", this.userList);
    //console.log("Score Up whoId:", whoId);
    let userIndex = this.userList.findIndex(u => u.id === whoId);
    this.userList[userIndex].score += 1;
    if (this.userList[userIndex].id === this.player1.id) {
      this.player2.lives -= 1;
      // Do UI stuff
    }
    if (this.userList[userIndex].id === this.player2.id) {
      this.player1.lives -= 1;
      // Do UI stuff
    }
  }

  getQueueUserList() {
    return Array.from(this.userList).sort((a, b) => a.queue - b.queue);
  }

  getQueueNames() {
    return Array.from(this.userList)
      .sort((a, b) => a.queue - b.queue)
      .map(user => user.username);
  }

  getQueueNamesAndPosition() {
    let userList = Array.from(this.userList);
    userList.sort((a, b) => a.queue - b.queue);

    return userList.map(userInList => {
      //console.log({ username: userInList.username, score: userInList.score });
      return { username: userInList.username, queue: userInList.queue, id: userInList.id };
    });
  }

  getQueueIdsAndPosition() {
    let userList = Array.from(this.userList);
    userList.sort((a, b) => a.queue - b.queue);

    return userList.map(userInList => {
      //console.log({ username: userInList.username, score: userInList.score });
      return { id: userInList.id, queue: userInList.queue, username: userInList.username };
    });
  }

  setObstacles(obstacles) {
    this.obstacles = obstacles;
  }

  getObstacles() {
    return this.obstacles;
  }

  setObjective(x, y) {
    this.objective = { x, y };
  }

  getObjective() {
    return this.objective;
  }

  setPlayer(slot, user) {
    if (slot === 1) {
      this.player1.id = user.id;
      this.player1.lives = 5;
    }
    if (slot === 2) {
      this.player2.id = user.id;
      this.player2.lives = 5;
    }
  }

  initPlayers(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
  }

  getPlayerPos(p) {
    //console.log("getPlayerPos, p1 & p2:", this.player1, this.player2);
    if (p === 2) {
      return this.player2.position;
    } else {
      return this.player1.position;
    }
  }

  setPlayerPos(p, x, y) {
    if (p === 2) {
      this.player2.position = { x, y };
    } else {
      this.player1.position = { x, y };
    }
  }

  static buildGrid() {
    let pBoard = document.querySelector("#player1-board");
    let eBoard = document.querySelector("#player2-board");
    for (let a = 0; a < 2; a++) {
      // Clear previous grids
      if (a) {
        while (pBoard.firstChild) {
          pBoard.removeChild(pBoard.firstChild);
        }
      } else {
        while (eBoard.firstChild) {
          eBoard.removeChild(eBoard.firstChild);
        }
      }
      // Insert new squares
      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
          let div = document.createElement("DIV");
          div.className = "square";
          div.setAttribute("x", x);
          div.setAttribute("y", y);
          if (a) {
            pBoard.appendChild(div);
          } else {
            eBoard.appendChild(div);
          }
        }
      }
    }
  }
}
