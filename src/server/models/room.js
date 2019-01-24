const Positions = require("../util/Positions");
const UserList = require("../util/UserList");

module.exports = class Room {
  constructor(name, owner) {
    this.name = name;
    this.owner = owner;
    this.obstacles = new Set();
    this.objective = Positions.ZERO;
    this.player1 = { id: owner.id, position: {...Positions.ZERO}, lives: 5 };
    this.player2 = { id: "", position: {...Positions.ZERO}, lives: 5 };
    this.userList = new Map([[owner.id, owner]]);

    //console.log("Getting new obstacle data.");
    let initialData = Room.getNewObstaclesPositions({
      obstacles: this.obstacles,
      player1: this.player1,
      player2: this.player2,
      objective: this.objective
    });
    //console.log("Success.");

    this.obstacles = new Set(initialData.obstacles.map(o => JSON.stringify(o)));
    this.objective = {...initialData.objective};
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

  clearPlayer(slot) {
    if (slot === 1) {
      this.player1 = { id: "", position: {...Positions.ZERO}, lives: 5 };
    }
    if (slot === 2) {
      this.player2 = { id: "", position: {...Positions.ZERO}, lives: 5 };
    }
  }

  getOnline() {
    return this.userList.size;
  }

  getObstaclesAsSet() {
    return this.obstacles;
  }

  getObstaclesAsArray() {
    return Array.from(this.obstacles);
  }

  getObstaclesAsObjectsArray () {
    return Array.from(this.obstacles).map(i => JSON.parse(i));
  }

  getQueueIdsAndPosition() {
    let userList = UserList.getUserListThatClientCanUnderstand(this.userList);
    userList.sort((a, b) => a.queue - b.queue);

    return userList.map(userInList => {
      //console.log({ username: userInList.username, score: userInList.score });
      return { id: userInList.id, queue: userInList.queue };
    });
  }

  static isValidName(roomName) {
    return roomName.length > 15 || roomName.length < 3;
  }

  static isInvalidCreationName(roomName, rooms) {
    if (roomName.length > 15 || roomName.length < 3) {
      return { error: "invalid room name" };
    }
    if (rooms.has(roomName)) {
      return { error: "room name already taken" };
    }
  }

  static isInvalidEnteringName(roomName, rooms) {
    if (roomName.length > 15 || roomName.length < 3) {
      return { error: "invalid room name" };
    }
    if (!rooms.has(roomName)) {
      return { error: "room not found" };
    }
  }

  static getNewObstaclesPositions(rm) {
    const currentRoom = { ...rm };
    currentRoom.obstacles.clear();
    const { player1, player2 } = currentRoom;

    // get new obstacles positions
    const newObstacles = [];
    do {
      const insert = {...Positions.ZERO};
      insert.x = Math.floor(Math.random() * 4);
      insert.y = Math.floor(Math.random() * 4);
      if (
        !(
          Positions.isSamePosition(player1.position, insert) ||
          Positions.isSamePosition(player2.position, insert)
        )
      ) {
        //console.log("p1", player1.position, "p2", player2.position, "insert", insert);
        newObstacles.push({ ...insert });
      }
      //console.log("New Obstacle",player1.position, player2.position, insert);
    } while (newObstacles.length <= 4);

    // get a new random objective position
    do {
      currentRoom.objective.x = Math.floor(Math.random() * 4);
      currentRoom.objective.y = Math.floor(Math.random() * 4);
      //console.log("New objective", player1.position, player2.position, currentRoom.objective);
    } while (
      Positions.isSamePosition(player1.position, currentRoom.objective) ||
      Positions.isSamePosition(player2.position, currentRoom.objective) ||
      newObstacles.find(i => Positions.isSamePosition(currentRoom.objective, i))
    );
    return {
      obstacles: newObstacles,
      objective: currentRoom.objective
    };
  }
};