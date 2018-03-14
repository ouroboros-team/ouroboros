import store from '../store';
import * as actionTypes from '../actionTypes';
import * as snakeHelpers from './snakeHelpers';
import * as p2pActions from '../p2p/p2pActionCreators';
import * as helpers from '../metaHelpers';
import * as constants from '../../constants';

export const changeSnakeDirection = (id, direction) => ({
  id,
  direction,
  type: actionTypes.CHANGE_SNAKE_DIRECTION,
});

export const handleChangeSnakeDirection = (id, direction) => (
  (dispatch) => {
    dispatch(changeSnakeDirection(id, direction));
    p2pActions.p2pBroadcastSnakeData();
  }
);

export const updateSnakeData = (id, data) => ({
  id,
  data,
  type: actionTypes.UPDATE_SNAKE_DATA,
});

export const resetSnakeData = () => ({
  type: actionTypes.RESET_SNAKE_DATA,
});

export const calculateNextCoords = (direction, oldCoords) => {
  let row = oldCoords.row;
  let column = oldCoords.column;

  switch (direction) {
    case 'up':
      row -= 1;
      if (row < 0) {
        row += constants.GRID_SIZE;
      }
      break;
    case 'down':
      row += 1;
      row %= constants.GRID_SIZE;
      break;
    case 'left':
      column -= 1;
      if (column < 0) {
        column += constants.GRID_SIZE;
      }
      break;
    case 'right':
    default:
      column += 1;
      column %= constants.GRID_SIZE;
      break;
  }

  return { row, column };
};

export const initializeOwnSnake = id => (
  (dispatch) => {
    const row = helpers.randomUniqueRow();
    const positions = snakeHelpers.setStartPosition(row);
    const snake = snakeHelpers.emptySnakeObject(positions);

    dispatch(updateSnakeData(id, snake));
    p2pActions.p2pBroadcastSnakeData();
  }
);

export const writeOwnSnakePosition = id => (
  (dispatch) => {
    const state = store.getState();
    const newSnake = { ...state.snakes[id] };
    const tu = state.info.tu;

    const coords = calculateNextCoords(newSnake.direction, newSnake.positions[String(tu)]);
    newSnake.positions = {};
    newSnake.positions[tu + 1] = coords;

    dispatch(updateSnakeData(id, newSnake));
    p2pActions.p2pBroadcastSnakeData();
  }
);

