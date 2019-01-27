import React, { Component } from "react";

import Layout from "../components/Layout/Layout";
import LoginScreen from "../components/LoginScreen/LoginScreen";
import RoomScreen from "../components/RoomScreen/RoomScreen";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      inGame: false,
      username: ""
    };
  }

  onLogin(e, username) {
    e.preventDefault();
    this.setState({ ...this.state, isLoggedIn: true, username });
    return false;
  }

  onEnterRoomSubmit(e, room) {
    e.preventDefault();
    // Validation logic
    this.setState({...this.state, inGame: true});
    console.log("Entering room:", room);
  }

  onCreateRoomSubmit(e, room) {
    e.preventDefault();
    // Validation logic
    this.setState({...this.state, inGame: true});
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
    return null;
  }

  render() {
    return <Layout>{this.getCurrentScreen()}</Layout>;
  }
}
export default App;
