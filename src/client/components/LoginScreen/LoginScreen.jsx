import React, { Component } from "react";
import PropTypes from "prop-types";

import trim from "validator/lib/trim";

import "./LoginScreen.css";

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.onLogin = props.onLogin;
    this.state = { username: "" };
  }

  render() {
    return (
      <div className="green lighten-5" id="login-screen">
        <h1 className="green-text">Welcome to Fast Squares!</h1>
        <h2 className="light-green-text">Please, name yourself:</h2>
        <div className="card-panel w60 p0 m0">
          <form
            id="login-form"
            onSubmit={e => this.onLogin(e, this.state.username)}
          >
            <input
              type="text"
              minLength="3"
              maxLength="15"
              className="fs8 green-text center"
              value={this.state.username}
              onChange={e => this.setState({ username: trim(e.target.value) })}
            />
          </form>
        </div>
      </div>
    );
  }
}

LoginScreen.propTypes = {
  onLogin: PropTypes.func.isRequired
};

export default LoginScreen;
