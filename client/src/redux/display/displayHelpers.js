import merge from 'lodash/merge';

import store from '../store';
import * as boardHelpers from '../board/boardHelpers';
import * as snakeHelpers from '../snake/snakeHelpers';
import * as helpers from '../metaHelpers';
import * as constants from '../../constants';

export const enqueueHeadMutate = (snake, nextPosition) => {
  snake.positions.unshift(nextPosition);
  return nextPosition;
};

export const calculateNextCoords = (direction, oldCoords) => {
  let row = Number(oldCoords.row);
  let column = Number(oldCoords.column);

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

  return { row, column, tu: oldCoords.tu + 1 };
};

export const aggregateBoards = (lastTu) => {
  const clonedBoards = helpers.deepClone(store.getState().boards);
  const length = snakeHelpers.getSnakeLength(lastTu);
  let aggregatedBoard = {};

  for (let i = (lastTu - length) + 1; i <= lastTu; i++) {
    // newer data overwrites older data, no collision checking yet
    if (clonedBoards[i]) {
      aggregatedBoard = merge(aggregatedBoard, clonedBoards[i]);
    }
  }

  return aggregatedBoard;
};

export const getInitialDisplayBoard = () => (
  aggregateBoards(constants.INITIAL_TU)
);

export const getNextDisplayBoard = () => {
  const state = store.getState();
  const tu = state.info.tu;
  const newBoard = aggregateBoards(tu);

  // combine boards needed for current snake length - 1
  // (predicted move will make full snake length)

  const snakesObj = helpers.deepClone(state.snakes);
  const snakeIds = Object.keys(snakesObj);

  const length = snakeHelpers.getSnakeLength(tu);

  let snake;
  let next;

  // predict next moves, fill in missing data with predictions
  snakeIds.forEach((id) => {
    snake = snakesObj[id];

    // run once for all snakes, more for snakes with missing TUs
    while (snake.positions[0].tu <= tu) {
      // calculate next coordinates (predicted)
      next = calculateNextCoords(snake.direction, snake.positions[0]);

      // add predicted coordinates to cloned snake object
      enqueueHeadMutate(snake, next);

      // add next position to newBoard if it is within range
      // (based on target TU and snake length)
      if (snake.positions[0].tu <= tu && snake.positions[0].tu > tu - length) {
        boardHelpers.addCoordinatesMutate(newBoard, next, snake, id);
      }
    }
  });

  return newBoard;
};
