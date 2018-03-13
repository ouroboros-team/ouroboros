import random from 'lodash/random';
import store from '../store';
import * as constants from '../../constants';

export const getSnakeLength = tu => (
  constants.INITIAL_SNAKE_LENGTH
);

export const emptySnakeObject = (positions = []) => ({
  direction: 'left',
  status: 'alive',
  positions,
});

export const getOwnSnakeData = () => {
  const state = store.getState();
  const id = state.p2p.id;
  return state.snakes[id];
};

export const setStartPosition = (row) => {
  const randomColumn = random(0, constants.GRID_SIZE - 1);

  return [
    { row, column: randomColumn, tu: 0 },
    { row, column: randomColumn + 1, tu: -1 },
    { row, column: randomColumn + 2, tu: -2 },
    { row, column: randomColumn + 3, tu: -3 },
  ];
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

  const gap = Math.abs(newSnake.positions[0].tu - data.positions[0].tu);
  let counter = gap;

  while (counter > 0) {
    // add new coordinates
    newSnake.positions.unshift(data.positions[gap - 1]);
    counter -= 1;
  }

  // purge surplus history
  const keepCount = getSnakeLength(newSnake.positions[0].tu) + constants.HISTORY_LENGTH;
  if (newSnake.positions.length > keepCount) {
    newSnake.positions.length = keepCount;
  }
};
