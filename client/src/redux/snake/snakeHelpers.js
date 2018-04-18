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
  let randomColumn = random(0, constants.GRID_SIZE - (constants.INITIAL_SNAKE_LENGTH + 1));

  // start on an odd column (simplifies head-on-collision logic)
  if (randomColumn % 2 === 0) {
    randomColumn += 1;
  }

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

// received data is in the same format as local snake data
export const updateSnakeDataMutate = (snake, data) => {
  snake.direction = data.direction;

  snake.positions.byKey = { ...snake.positions.byKey, ...data.positions.byKey };
  snake.positions.newest = data.positions.newest;

  const keepCount = getSnakeLength(snake.positions.newest) + constants.HISTORY_LENGTH;

  // purge old data
  while (snake.positions.newest - snake.positions.oldest > keepCount) {
    delete snake.positions.byKey[snake.positions.oldest];
    snake.positions.oldest += 1;
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
