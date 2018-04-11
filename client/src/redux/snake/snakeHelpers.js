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

  if (snakeClone.positions.newest - snakeClone.positions.newest >= constants.P2P_TUS) {
    const truncByKey = {};

    // populate truncated byKey list
    let counter = 0;
    let tu = snakeClone.positions.newest - counter;

    while (snakeClone.positions.byKey[tu] && counter < constants.P2P_TUS) {
      truncByKey[tu] = snakeClone.positions.byKey[tu];
      counter -= 1;
      tu = snakeClone.positions.newest - counter;
    }

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

  return {
    newest: 0,
    oldest: -3,
    byKey: hash,
  };
};

export const snakeIsAlive = (id, snakesObj, currentTU) => {
  let snakes = snakesObj;
  let tu = currentTU;
  const state = store.getState();
  const status = state.info.gameStatus;

  if (!snakes) {
    snakes = state.snakes;
  }

  if (!tu) {
    tu = state.info.tu;
  }

  // if out of sync, ignore relationship to local tu
  if (status === constants.GAME_STATUS_OUT_OF_SYNC) {
    return snakes[id] && snakes[id].tuOfDeath === null;
  }

  // snake is alive if...
  // snake exists, has no tuOfDeath or tuOfDeath comes after current TU
  return snakes[id] && (snakes[id].tuOfDeath === null || snakes[id].tuOfDeath > tu);
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
  const oldLastTu = oldPositions.newest;
  const newLastTu = newPositions.newest;

  const keepCount = getSnakeLength(newLastTu) + constants.HISTORY_LENGTH;
  const gap = newLastTu - oldLastTu;
  let key;
  let i = 1;

  while (i <= gap) {
    key = oldLastTu + i;
    // add new positions to old ones
    oldPositions.byKey[key] = newPositions.byKey[key];
    oldPositions.newest = key;

    // purge old data
    if (oldPositions.newest - oldPositions.oldest > keepCount) {
      delete oldPositions.byKey[oldPositions.oldest];
      oldPositions.oldest += 1;
    }

    i += 1;
  }
};

export const getTuGap = (id, newData) => {
  const oldSnake = store.getState().snakes[id];

  if (!oldSnake) {
    return false;
  }

  const oldLastTu = oldSnake.positions.newest;
  const newLastTu = newData.positions.newest;

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
    if (snakeIsAlive(id)) {
      livingSnakes.push(id);
    }
  });

  return p2pHelpers.resolveIdsToUsernames(livingSnakes);
};
