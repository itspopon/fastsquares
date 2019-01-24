module.exports = class User {
  constructor (id, username) {
    this.id = id;
    this.username = username;
    this.room = "";
    this.type = "";
    this.position = {x: 0, y: 0};
    this.queue = 0;
    this.score = 0;
  }

  getId () {
    return this.id;
  }

  getUsername () {
    return this.username;
  }

  getRoom () {
    if (this.room === "") {
      return false;
    } else {
      return this.room;
    }
  }

  setRoom (room) {
    this.room = room;
  }

  getType () {
    return this.type;
  }

  setType (type) {
    this.type = type;
  }

  getPosition () {
    return this.position;
  }

  setPosition (x, y) {
    this.position.x = x;
    this.position.y = y;
  }

  getQueuePosition () {
    return this.queue;
  }

  moveFowardInQueue () {
    return --this.queue;
  }

  getScore () {
    return this.score;
  }

  scoreUp () {
    this.score++;
  }

  reset() {
    this.room = "";
    this.type = "";
    this.position = {x: 0, y: 0};
    this.score = 0;
    this.queue = 0;
  }
}