import random from 'lodash/random';
import store from '../store';
import * as constants from '../../constants';

export const getSnakeLength = tu => (
  constants.INITIAL_SNAKE_LENGTH + Math.floor(tu / 10)
);

export const emptySnakeObject = (positions = {}) => ({
  direction: 'left',
  status: constants.SNAKE_STATUS_ALIVE,
  positions,
});

export const getOwnSnakeData = () => {
  const state = store.getState();
  const id = state.p2p.id;
  return state.snakes[id];
};

export const setStartPosition = (row) => {
  const randomColumn = random(0, constants.GRID_SIZE - constants.INITIAL_SNAKE_LENGTH);

  const hash = {
    '0': { row, column: randomColumn },
    '-1': { row, column: randomColumn + 1 },
    '-2': { row, column: randomColumn + 2 },
    '-3': { row, column: randomColumn + 3 },
  };

  const array = [ '0', '-1', '-2', '-3' ];

  return {
    byIndex: array,
    byKey: hash,
  };
};

export const snakeIsAlive = (id, snakesObj) => {
  let snakes = snakesObj;
  if (!snakes) {
    snakes = store.getState().snakes;
  }

  return snakes[id] && snakes[id].status === constants.SNAKE_STATUS_ALIVE;
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

// data is assumed to be in the same format as snakes in the Redux store
export const updateSnakeDataMutate = (newSnake, data) => {
  newSnake.direction = data.direction;

  const oldPositions = newSnake.positions;
  const newPositions = data.positions;
  const oldLastTu = Number(oldPositions.byIndex[0]);
  const newLastTu = Number(newPositions.byIndex[0]);

  const keepCount = getSnakeLength(newLastTu) + constants.HISTORY_LENGTH;
  let gap = newLastTu - oldLastTu;
  let key;
  let toRemove;

  while (gap > 0) {
    key = `${newLastTu - (gap - 1)}`;
    // add new positions to old ones
    oldPositions.byKey[key] = newPositions.byKey[key];
    oldPositions.byIndex.unshift(key);

    // purge old data
    if (oldPositions.byIndex.length > keepCount) {
      toRemove = oldPositions.byIndex.pop();
      delete oldPositions.byKey[toRemove];
    }

    gap -= 1;
  }
};
