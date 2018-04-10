import random from 'lodash/random';
import cloneDeep from 'lodash/cloneDeep';

import store from '../store';
import * as constants from '../../constants';
import * as headSetHelpers from '../headSet/headSetHelpers';

export const getSnakeLength = tu => (
  constants.INITIAL_SNAKE_LENGTH + Math.floor(tu / 10)
);

export const emptySnakeObject = (positions = {}) => ({
  direction: 'left',
  status: constants.SNAKE_STATUS_ALIVE,
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

export const getCollisionType = (sqNum, myID, peerID) => {
  const peerSnake = store.getState().snakes[peerID];
  const peerHeadTU = peerSnake.positions.newest;
  const peerHeadSqNum = headSetHelpers.coordsToSquareNumber(peerSnake.positions.byKey[peerHeadTU]);
  const peerTailTU = peerSnake.positions.oldest;
  const peerTailSqNum = headSetHelpers.coordsToSquareNumber(peerSnake.positions.byKey[peerTailTU]);

  if (myID !== peerID && sqNum === peerHeadSqNum) {
    return constants.COLLISION_TYPE_HEAD_ON_HEAD;
  } else if (sqNum === peerTailSqNum) {
    return constants.COLLISION_TYPE_HEAD_ON_TAIL;
  }

  return constants.COLLISION_TYPE_HEAD_ON_BODY;
};

export const checkForGameOver = () => {
  const state = store.getState();
  const snakeIds = Object.keys(state.snakes);
  const snakeCount = snakeIds.length;
  const snakesAlive = [];

  snakeIds.forEach((id) => {
    if (snakeIsAlive(id, state.snakes)) {
      snakesAlive.push(id);
    }
  });

  const aliveCount = snakesAlive.length;

  if ((snakeCount > 1 && aliveCount <= 1) ||
    (snakeCount === 1 && aliveCount === 0)) {
    return snakesAlive[0];
  }

  return false;
};
