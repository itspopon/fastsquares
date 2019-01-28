import React, { Component } from "react";
import PropTypes from "prop-types";

import Header from "../../components/GameScreen/Header/Header";
import Board from "../../components/GameScreen/Board/Board";
import ChatBox from "../../components/GameScreen/ChatBox/ChatBox";

export default class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.username,
      room: props.room,
      socket: props.socket,
      users: [
        { username: "mea", score: 12, queue: 1 },
        { username: "zubon", score: 33, queue: 2 }
      ],
      player1: { id: "", position: { x: 0, y: 0 } },
      player2: { id: "", position: { x: 0, y: 0 } },
      objective: { x: 3, y: 3 },
      obstacles: new Set([JSON.stringify({ x: 1, y: 1 })])
    };
  }

  componentDidMount() {
    this.state.socket.emit("login", { username: this.state.username });
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
  socket: PropTypes.object.isRequired
};
