import React, { Component } from "react";
import io from "socket.io-client";

import { isValidName } from "../util/Input";

import Layout from "../components/Layout/Layout";
import LoginScreen from "../components/LoginScreen/LoginScreen";
import RoomScreen from "../components/RoomScreen/RoomScreen";
import Room from "./Room";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Basics
      isLoggedIn: false,
      inGame: false,
      username: "",
      room: "",
      socket: io()
    };
  }

  onLogin(e, username) {
    e.preventDefault();
    if (!isValidName(username)) {
      alert(
        "Please choose a name that is between 3 and 15 characters long and that only uses letters and numbers."
      );
      return;
    }
    this.setState({ ...this.state, isLoggedIn: true, username: username });
  }

  onEnterRoomSubmit(e, room) {
    e.preventDefault();
    if (!isValidName(room)) {
      alert(
        "Please enter a room name that is between 3 and 15 characters long and that only uses letters and numbers."
      );
      return;
    }
    this.setState({ ...this.state, room, inGame: true });
    console.log("Entering room:", room);
  }

  onCreateRoomSubmit(e, room) {
    e.preventDefault();
    if (!isValidName(room)) {
      alert(
        "Please enter a room name that is between 3 and 15 characters long and that only uses letters and numbers."
      );
      return;
    }
    this.setState({ ...this.state, room, inGame: true });
    console.log("Creating room:", room);
  }

  getCurrentScreen() {
    // Return login screen if not logged in
    if (!this.state.isLoggedIn) {
      return (
        <LoginScreen onLogin={(e, username) => this.onLogin(e, username)} />
      );
    }
    // If logged in but not in game, return room screen
    if (!this.state.inGame) {
      return (
        <RoomScreen
          username={this.state.username}
          onEnter={(e, room) => this.onEnterRoomSubmit(e, room)}
          onCreate={(e, room) => this.onCreateRoomSubmit(e, room)}
        />
      );
    }
    return (
      <Room
        username={this.state.username}
        room={this.state.room}
        socket={this.state.socket}
      />
    );
  }

  render() {
    return <Layout>{this.getCurrentScreen()}</Layout>;
  }
}
export default App;
