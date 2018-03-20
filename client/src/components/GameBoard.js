import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Square from './Square';
import { GRID_SIZE } from '../constants';

const GameBoard = (props) => {
  let status;
  let styleId;
  const squares = [];

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (props.board[r] && props.board[r][c] && props.board[r][c].snake) {
        status = props.board[r][c].snake.status;
        styleId = props.board[r][c].snake.styleId;
      } else {
        status = 'empty';
        styleId = undefined;
      }

      squares.push(
        <Square
          col={c}
          key={(r * GRID_SIZE) + c}
          row={r}
          status={status}
          styleId={styleId}
        />,
      );
    }
  }

  return (
    <div id='board-container'>
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
  board: state.board,
});

export default connect(mapStateToProps)(GameBoard);
