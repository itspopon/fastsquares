import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import * as Square from "../../../util/Square";

class Board extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      which: props.which,
      player1: props.player1,
      player2: props.player2,
      objective: props.objective,
      obstacles: props.obstacles
    };
  }

  getSquares() {
    let squares = [];
    let p;
    let obs = this.state.obstacles;
    let obj = this.state.objective;
    if (this.state.which === 1) {
      p = this.state.player1.position;
    }
    if (this.state.which === 2) {
      p = this.state.player2.position;
    }
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        let classes = "square";
        if (Square.isSame(p, {x,y})) {
          classes += " player" + this.state.which;
        }
        if (Square.isSame(obj, {x,y})) {
          classes += " objective";
        }
        if (obs.has(JSON.stringify({x,y}))) {
          classes += " obstacle";
        }
        squares.push(
          <div key={x + "," + y} className={classes} />
        );
      }
    }
    return squares;
  }

  render() {
    let p = this.state.which;
    return (
      <div id={`slot${p}-holder`}>
        <div className="slot-name-holder">
          <span className={`slot${p}-name`} />
          <span className={`slot${p}-lives secondary-content`} />
        </div>
        <div className="card-panel green lighten-3" id={`player${p}-board`}>
          {this.getSquares()}
        </div>
      </div>
    );
  }
}

Board.propTypes = {
  player1: PropTypes.shape({
    id: PropTypes.string.isRequired,
    position: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    })
  }).isRequired,
  player2: PropTypes.shape({
    id: PropTypes.string.isRequired,
    position: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    })
  }).isRequired,
  obstacles: PropTypes.object.isRequired,
  objective: PropTypes.shape({x: PropTypes.number, y: PropTypes.number}),
  which: PropTypes.number.isRequired
};

export default Board;
