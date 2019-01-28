import React, { Component } from "react";
import PropTypes from "prop-types";

import trim from "validator/lib/trim";

import "./RoomScreen.css";

class RoomScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {enterRoom: "", createRoom: "", username: props.username};
    this.onEnter = props.onEnter;
    this.onCreate = props.onCreate;
  }

  render() {
    return (
      <div className="green lighten-5" id="room-screen">
        <h1 className="green-text">{this.state.username}</h1>

        <div className="card-panel w60 p0 m0">
          <form id="enter-room-form" onSubmit={e => this.onEnter(e, this.state.enterRoom)}>
            <label htmlFor="enter-room-name">Enter Room: </label>
            <input
              name="enter-room-name"
              type="text"
              minLength="3"
              maxLength="15"
              className="fs8 green-text center"
              value={this.state.enterRoom}
              onChange={e => this.setState({enterRoom: trim(e.target.value)})}
            />
          </form>
        </div>
        <div className="card-panel w60 p0 m0">
          <form id="create-room-form" onSubmit={e => this.onCreate(e, this.state.createRoom)}>
            <label htmlFor="create-room-name">Create Room: </label>
            <input
              name="create-room-name"
              type="text"
              minLength="3"
              maxLength="15"
              className="fs8 green-text center"
              value={this.state.createRoom}
              onChange={e => this.setState({createRoom: trim(e.target.value)})}
            />
          </form>
        </div>
      </div>
    );
  }
}

RoomScreen.propTypes = {
  username: PropTypes.string.isRequired,
  onEnter: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired
};

export default RoomScreen;
