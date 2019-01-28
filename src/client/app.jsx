import React, { Component } from "react";
import io from "socket.io-client";

import { isValidName } from "./util/Input";

import Layout from "./components/Layout/Layout";
import LoginScreen from "./components/LoginScreen/LoginScreen";
import RoomScreen from "./components/RoomScreen/RoomScreen";
import Room from "./containers/Room/Room";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Basics
      isLoggedIn: false,
      inGame: false,
      username: "",
      room: "",
      roomData: {},
      socket: io()
    };
  }

  componentDidMount() {
    this.state.socket.on("entering room", data => {
      this.setState({ ...this.state, room: data.room, inGame: true });
      console.log("Entering room:", data.room);
    });

    this.state.socket.on("room created", data => {
      this.setState({
        ...this.state,
        room: data.room,
        slot: 1,
        roomData: {
          ...data,
          owner: { id: this.state.socket.id, username: this.state.username }
        },
        inGame: true
      });
      console.log("Creating room:", data);
    });

    this.state.socket.on("invalid", data => alert(data));
  }

  // When user enters a username
  onLogin = (e, username) => {
    e.preventDefault();
    if (!isValidName(username)) {
      alert(
        "Please choose a name that is 3-15 characters long and uses only letters and numbers."
      );
      return;
    }
    this.state.socket.emit("login", { username });
    this.setState({ ...this.state, isLoggedIn: true, username: username });
  };

  // When user tries to enter a room
  onEnterRoomSubmit = (e, room) => {
    e.preventDefault();
    if (!isValidName(room)) {
      alert(
        "Please enter a name that is 3-15 characters long and uses only letters and numbers."
      );
      return;
    }
    /* Emit a "enter room" event */
    this.state.socket.emit("enter room", {
      username: this.state.username,
      room
    });
  };

  // When user tries to create a room
  onCreateRoomSubmit = (e, room) => {
    e.preventDefault();
    if (!isValidName(room)) {
      alert(
        "Please enter a name that is 3-15 characters long and uses only letters and numbers."
      );
      return;
    }
    /* Emit a "create room" event */
    console.log("Emitting create room socket");
    this.state.socket.emit("create room", {
      username: this.state.username,
      room
    });
  };

  getCurrentScreen() {
    // Return login screen if not logged in
    if (!this.state.isLoggedIn) {
      return <LoginScreen onLogin={this.onLogin} />;
    }
    // If logged in but not in game, return room screen
    if (!this.state.inGame) {
      return (
        <RoomScreen
          username={this.state.username}
          onEnter={this.onEnterRoomSubmit}
          onCreate={this.onCreateRoomSubmit}
        />
      );
    }
    return (
      <Room
        username={this.state.username}
        room={this.state.room}
        socket={this.state.socket}
        roomData={this.state.roomData}
      />
    );
  }

  render() {
    return <Layout>{this.getCurrentScreen()}</Layout>;
  }
}
export default App;
