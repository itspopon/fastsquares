import React from "react";
import PropTypes from "prop-types";

const formatLeaderboard = users => {
  return users
    .sort((a, b) => b.score - a.score)
    .map((user, i) => <li key={i}>{`${user.username}: ${user.score}`}</li>);
};

const formatQueue = users => {
  return users
    .sort((a, b) => a.queue - b.queue)
    .map((user, i) => <li key={i}>{`${user.username}`}</li>);
};

const Header = props => {
  return (
    <div className="card-panel green p2" id="header">
      <div className="leaderboard card">
        <span className="card-title">Leaderboard</span>
        <div className="card-content">
          {/* User list in order of score */}
          <ul>{formatLeaderboard(props.users)}</ul>
        </div>
      </div>
      <div className="queue card">
        <span className="card-title">
          <span className="room">000</span>(<span className="room-num-users" />)
          - Queue:
        </span>
        <div className="card-content">
          {/* User list is order of queue */}
          <ul>{formatQueue(props.users)}</ul>
        </div>
      </div>
      <div className="room-details card pt5">
        <span className="card-title">Room</span>
        <div className="card-content details pt0">
          {/* Rooms info */}
          <button
            className="btn btn-small red white-text m0 mt3 secondary-content"
            id="leave-room"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
};

Header.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object)
};

export default Header;
