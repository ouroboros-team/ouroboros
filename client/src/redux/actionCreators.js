import * as actionTypes from './actionTypes';

export const incrementTu = () => ({
  type: actionTypes.INCREMENT_TU,
});

export const changeSnakeDirection = (id, direction) => ({
  id,
  direction,
  type: actionTypes.CHANGE_SNAKE_DIRECTION,
});
