import random from 'lodash/random';
import merge from 'lodash/merge';
import store from '../store';
import * as constants from '../../constants';

export const getSnakeLength = tu => (
  constants.INITIAL_SNAKE_LENGTH + Math.floor(tu / 10)
);

export const emptySnakeObject = (positions = {}) => ({
  direction: 'left',
  status: 'alive',
  positions,
});

export const getOwnSnakeData = () => {
  const state = store.getState();
  const id = state.p2p.id;
  return state.snakes[id];
};

export const getMostRecentTu = (id) => {
  const snake = store.getState().snakes[id];
  const tus = Object.keys(snake.positions).map(string => (Number(string)));

  return Math.max(...tus);
};

export const setStartPosition = (row) => {
  const randomColumn = random(0, constants.GRID_SIZE - 1);

  return {
    '0': { row, column: randomColumn },
    '-1': { row, column: randomColumn + 1 },
    '-2': { row, column: randomColumn + 2 },
    '-3': { row, column: randomColumn + 3 },
  };
};

export const validateDirectionChange = (oldDir, newDir) => {
  switch (oldDir) {
    case 'down':
    case 'up':
      if (newDir === 'left' || newDir === 'right') {
        return true;
      }
      break;
    case 'left':
    case 'right':
    default:
      if (newDir === 'up' || newDir === 'down') {
        return true;
      }
  }

  return false;
};


// data is assumed to be in the same format as snakes in the Redux store
export const updateSnakeDataMutate = (newSnake, data) => {
  newSnake.direction = data.direction;

  newSnake.positions = merge(newSnake.positions, data.positions);

  // TODO: purge surplus history
  // const keepCount = getSnakeLength(newSnake.positions[0].tu) +
  // constants.HISTORY_LENGTH;
};
