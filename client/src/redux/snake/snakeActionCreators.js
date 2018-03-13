import store from '../store';
import * as actionTypes from '../actionTypes';
import * as snakeHelpers from './snakeHelpers';
import * as displayHelpers from '../display/displayHelpers';
import * as p2pActions from '../actionCreators';


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

export const initializeOwnSnake = (id, row) => (
  (dispatch) => {
    const positions = snakeHelpers.setStartPosition(row);
    const snake = snakeHelpers.emptySnakeObject(positions);

    dispatch(updateSnakeData(id, snake));
    p2pActions.p2pBroadcastSnakeData();
  }
);

export const writeOwnSnakePosition = id => (
  (dispatch) => {
    const newSnake = { ...store.getState().snakes[id] };

    const coords = displayHelpers.calculateNextCoords(newSnake.direction, newSnake.positions[0]);
    newSnake.positions = [ coords ];

    dispatch(updateSnakeData(id, newSnake));
    p2pActions.p2pBroadcastSnakeData();
  }
);

