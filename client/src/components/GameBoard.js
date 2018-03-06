import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Square from './Square';
import { GRID_SIZE } from '../constants';

const GameBoard = (props) => {
  let status;
  let snakeId;
  const squares = [];

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (props.board[r] && props.board[r][c]) {
        status = props.board[r][c].snake.status;
        snakeId = props.board[r][c].id;
      } else {
        status = 'empty';
        snakeId = undefined;
      }

      squares.push(
        <Square
          col={c}
          key={(r * GRID_SIZE) + c}
          row={r}
          status={status}
          snakeId={snakeId}
        />,
      );
    }
  }

  return (
    <div id='board-container' className='nine columns'>
      <div id='board'>
        {squares}
      </div>
    </div>
  );
};

GameBoard.propTypes = {
  board: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

GameBoard.defaultProps = {
  board: {},
};

const mapStateToProps = state => ({
  board: state.displayBoard,
});

export default connect(mapStateToProps)(GameBoard);
