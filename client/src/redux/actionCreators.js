import * as actionTypes from './actionTypes';

// info
export const incrementTu = () => ({
  type: actionTypes.INCREMENT_TU,
});

// snakes
export const changeSnakeDirection = (id, direction) => ({
  id,
  direction,
  type: actionTypes.CHANGE_SNAKE_DIRECTION,
});

// board
export const aggregateInitialBoard = () => ({
  type: actionTypes.AGGREGATE_INITIAL_BOARD,
});

// display board
export const getNextDisplayBoard = () => ({
  type: actionTypes.GET_NEXT_DISPLAY_BOARD,
});
