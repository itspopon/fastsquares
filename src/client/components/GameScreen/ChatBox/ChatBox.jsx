import React, { Component } from "react";
import PropTypes from "prop-types";

import escape from "validator/lib/escape";
import isLength from "validator/lib/isLength";

const getNameColor = (msgItem, username) => {
  if (msgItem.username === "@") {
    return "grey-text";
  }
  if (msgItem.isPlayer) {
    return "blue-text";
  } else {
    return "red-text";
  }
};

const MessageList = props => {
  /* props.messages > array of objects {username, message[, isPlayer]} */
  return (
    <div className="chat-container">
      {props.messages.map(msgItem => {
        return (
          <div className="animated fadeIn fastest chat-message">
            <span className={getNameColor(msgItem, props.username)}>
              {msgItem.username}
            </span>
            {msgItem.message}
          </div>
        );
      })}
    </div>
  );
};

class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.username,
      room: props.room,
      users: props.users,
      socket: props.socket,
      chat: "",
      storedMessages: []
    };
    props.socket.on("new message", data => {
      let newMessages = [];
      newMessages = [...this.state.storedMessages];
      if (this.state.storedMessages.length >= 20) {
        newMessages.shift();
      }
      newMessages.push({ username: data.username, message: data.message });
      this.setState({ ...this.state, storedMessages: newMessages });
    });
  }

  sendMessage(event) {
    event.preventDefault();
    if (!isLength(this.state.chat, { min: 1, max: 255 })) return;
    this.state.socket.emit("chat message", {
      username: this.state.username,
      message: this.state.chat
    });
    let newMessages = [];
    newMessages = [...this.state.storedMessages];
    if (this.state.storedMessages.length >= 20) {
      newMessages.shift();
    }
    newMessages.push({ username: this.state.username, message: this.state.chat, isPlayer: true });
    this.setState({ ...this.state, storedMessages: newMessages, chat: "" });
  }

  render() {
    return (
      <div className="card-panel green lighten-5 h100 pt1" id="chat">
        <span className="green-text">
          <b>
            <span className="fs2">{this.state.username}</span>
          </b>{" "}
          - <span>{this.state.room}</span> (
          <span>{this.state.users.length}</span>)
        </span>
        <hr className="white-text" />
        <div className="card-panel h80 p0">
          <MessageList
            messages={this.state.storedMessages}
            username={this.state.username}
          />
          <form className="p0 m0" onSubmit={e => this.sendMessage(e)}>
            <div className="flex flex-center-vertical">
              <div className="w90 p0 m0">
                <input
                  type="text"
                  id="m"
                  autoFocus
                  autoComplete="off"
                  onChange={e =>
                    this.setState({ chat: escape(e.target.value) })
                  }
                  value={this.state.chat}
                />
              </div>
              <input type="submit" className="btn w10" value=">" />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

MessageList.propTypes = {
  username: PropTypes.string.isRequired,
  messages: PropTypes.array.isRequired
};

ChatBox.propTypes = {
  username: PropTypes.string.isRequired,
  room: PropTypes.string.isRequired,
  socket: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired
};

export default ChatBox;
