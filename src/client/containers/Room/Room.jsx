import React, { Component } from "react";
import PropTypes from "prop-types";

import Header from "../../components/GameScreen/Header/Header";
import Board from "../../components/GameScreen/Board/Board";
import ChatBox from "../../components/GameScreen/ChatBox/ChatBox";

export default class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: props.socket,
      /* User */
      username: props.username,
      slot: props.slot,
      /* Room */
      room: props.room,
      users: props.roomData.userList,
      owner: props.roomData.owner,
      player1: props.player1,
      player2: props.player2,
      objective: props.roomData.objective,
      obstacles: new Set(props.roomData.obstacles)
    };
  }

  componentDidMount() {
    this.state.socket.emit("login", { username: this.state.username });
    console.log("Userlist:",this.state.users);
  }

  render() {
    let {
      username,
      users,
      room,
      socket,
      player1,
      player2,
      objective,
      obstacles
    } = this.state;
    return (
      <>
        <Header users={users} />
        <Board
          which={1}
          player1={player1}
          player2={player2}
          objective={objective}
          obstacles={obstacles}
        />
        <ChatBox
          username={username}
          room={room}
          socket={socket}
          users={users}
        />
        <Board
          which={2}
          player1={player1}
          player2={player2}
          objective={objective}
          obstacles={obstacles}
        />
        <h1>{username}</h1>
        <h2>{room}</h2>
      </>
    );
  }
}

Room.propTypes = {
  username: PropTypes.string.isRequired,
  room: PropTypes.string.isRequired,
  socket: PropTypes.object.isRequired,
  roomData: PropTypes.object.isRequired
};
