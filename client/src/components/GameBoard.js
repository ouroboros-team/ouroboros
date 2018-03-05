import React from 'react';
import PropTypes from 'prop-types';

import Square from './Square';
import { connect } from "react-redux";
import { GRID_SIZE } from "../constants";

class GameBoard extends React.Component {
  render() {
    let status = 'empty';
    let snakeId = undefined;
    let theBoard = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        theBoard.push(
          <Square
            col={c}
            key={(r * GRID_SIZE) + c}
            row={r}
            status={(this.props.board[r] && this.props.board[r][c]) ? this.props.board[r][c].status : status}
            snakeId={(this.props.board[r] && this.props.board[r][c]) ? this.props.board[r][c].snakeId : snakeId}
          />
        );
      }
    }

    return (
      <div id='board' className='nine columns'>
        <div id='board'>
          {theBoard}
        </div>
      </div>
    );
  }
}

GameBoard.propTypes = {
  board: PropTypes.array,
};

GameBoard.defaultProps = {
  board: []
};


const mapStateToProps = state => ({
  board: state.displayBoard,
});

export default connect(mapStateToProps)(GameBoard);
