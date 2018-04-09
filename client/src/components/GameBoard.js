import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Square from './Square';
import { GRID_SIZE } from '../constants';

const GameBoard = (props) => {
  let status;
  let styleId;
  const squares = [];

  for (let n = 0; n < GRID_SIZE * GRID_SIZE; n++) {
      if (props.board[n] && props.board[n].snake) {
        status = !props.board[n].snake.tuOfDeath ? 'alive' : 'dead';
        styleId = props.board[n].snake.styleId;
      } else {
        status = 'empty';
        styleId = undefined;
      }

      squares.push(
        <Square
          key={n}
          number={n}
          status={status}
          styleId={styleId}
        />,
      );
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
