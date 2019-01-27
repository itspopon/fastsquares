import React from "react";
//import PropTypes from "prop-types";

import "./LoginScreen.css";

export default () => {
  return (
    <div className="green lighten-5" id="login-screen">
      <h1 className="green-text">Welcome to Fast Squares!</h1>
      <h2 className="light-green-text">Please, name yourself:</h2>
      <div className="card-panel w60 p0 m0">
        <form id="login-form">
          <input
            type="text"
            minLength="3"
            maxLength="15"
            className="fs8 green-text center"
            id="l"
          />
        </form>
      </div>
    </div>
  );
};

//LoginScreen.propTypes = {};
