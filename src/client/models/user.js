export default class User {
  constructor(id) {
    this.id = id;
    this.username = "";
    this.room = "";
    /*either player1 player2 or spectator*/
    this.slot = "";
  }

  login(username) {
    this.username = username;
  }

  isLoggedIn() {
    return !this.username === "";
  }

  getId() {
    return this.id;
  }

  getUsername() {
    return this.username;
  }

  getSlot() {
    return this.slot;
  }

  setSlot(slot) {
    if (slot === 1) {
      this.slot = "player1";
      return;
    }
    if (slot === 2) {
      this.slot = "player2";
      return;
    }
    this.slot = "spectator";
  }

  isSpectator() {
    return this.slot === "spectator";
  }

  setRoom(room) {
    this.room = room;
  }

  getRoom () {
    return this.room;
  }

  reset() {
    this.room = "";
    this.slot = "";
  }
}
