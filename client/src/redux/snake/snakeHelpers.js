import random from 'lodash/random';
import cloneDeep from 'lodash/cloneDeep';

import store from '../store';
import * as constants from '../../constants';

import * as p2pHelpers from '../p2p/p2pHelpers';

export const getSnakeLength = tu => (
  constants.INITIAL_SNAKE_LENGTH + Math.floor(tu / 10)
);

export const emptySnakeObject = (positions = {}) => ({
  direction: 'left',
  tuOfDeath: null,
  positions,
});

export const snakeDataForBroadcast = () => {
  const state = store.getState();
  const id = state.p2p.id;
  const snakeClone = cloneDeep(state.snakes[id]);

  // if too long, truncate byIndex list
  if (snakeClone.positions.byIndex.length > constants.P2P_TUS) {
    snakeClone.positions.byIndex.length = constants.P2P_TUS;

    const truncByKey = {};

    // populate truncated byKey list
    snakeClone.positions.byIndex.forEach((tu) => {
      truncByKey[tu] = snakeClone.positions.byKey[tu];
    });

    // overwrite byKey with truncated list
    snakeClone.positions.byKey = truncByKey;
  }

  return snakeClone;
};

export const setStartPosition = (row) => {
  const randomColumn = random(0, constants.GRID_SIZE - constants.INITIAL_SNAKE_LENGTH);

  const hash = {
    '0': { row, column: randomColumn },
    '-1': { row, column: randomColumn + 1 },
    '-2': { row, column: randomColumn + 2 },
    '-3': { row, column: randomColumn + 3 },
  };
  const array = [ 0, -1, -2, -3 ];

  return {
    byIndex: array,
    byKey: hash,
  };
};

export const snakeIsAlive = (id, snakesObj, currentTU) => {
  let snakes = snakesObj;
  let tu = currentTU;
  const state = store.getState();

  if (!snakes) {
    snakes = state.snakes;
  }

  if (!tu) {
    tu = state.info.tu;
  }

  // snake is alive if...
  // snake exists, has no tuOfDeath or tuOfDeath comes after current TU
  return snakes[id] && (!snakes[id].tuOfDeath || snakes[id].tuOfDeath > tu);
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
  const oldLastTu = oldPositions.byIndex[0];
  const newLastTu = newPositions.byIndex[0];

  const keepCount = getSnakeLength(newLastTu) + constants.HISTORY_LENGTH;
  let gap = newLastTu - oldLastTu;
  let key;
  let toRemove;

  while (gap > 0) {
    key = newLastTu - (gap - 1);
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

export const getTuGap = (id, newData) => {
  const oldSnake = store.getState().snakes[id];

  if (!oldSnake) {
    return false;
  }

  const oldLastTu = oldSnake.positions.byIndex[0];
  const newLastTu = newData.positions.byIndex[0];

  return newLastTu - oldLastTu;
};

export const checkForGameOver = () => {
  const state = store.getState();
  const aliveCount = state.info.livingSnakeCount;
  const snakeCount = Object.keys(state.snakes).length;

  return ((snakeCount > 1 && aliveCount <= 1) ||
    (snakeCount === 1 && aliveCount === 0));
};

export const getWinners = () => {
  const state = store.getState();
  const snakes = state.snakes;
  const snakeIds = Object.keys(state.snakes);
  const livingSnakeCount = state.info.livingSnakeCount;

  if (livingSnakeCount === 0) {
    // looking for last death(s)
    let lastDeathTu = 0;
    let lastDeathIds = [];

    snakeIds.forEach((id) => {
      if (snakes[id].tuOfDeath > lastDeathTu) {
        lastDeathTu = snakes[id].tuOfDeath;
        lastDeathIds = [ id ];
      } else if (snakes[id].tuOfDeath === lastDeathTu) {
        lastDeathIds.push(id);
      }
    });

    return p2pHelpers.resolveIdsToUsernames(lastDeathIds);
  }

  // looking for living snake(s)
  const livingSnakes = [];

  snakeIds.forEach((id) => {
    if (!snakes[id].tuOfDeath) {
      livingSnakes.push(id);
    }
  });

  return p2pHelpers.resolveIdsToUsernames(livingSnakes);
};
