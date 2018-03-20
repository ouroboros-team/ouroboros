import merge from 'lodash/merge';

import store from '../store';
import * as boardHelpers from '../board/boardHelpers';
import * as snakeHelpers from '../snake/snakeHelpers';
import * as helpers from '../metaHelpers';
import * as constants from '../../constants';

export const aggregateBoards = (lastTu) => {
  const state = store.getState();
  const boards = state.boards;
  const length = snakeHelpers.getSnakeLength(lastTu);
  let aggregatedBoard = {};

  let i = lastTu - (length - 1);
  while (i <= lastTu) {
    aggregatedBoard = merge(aggregatedBoard, boards[i]);
    i += 1;
  }

  return aggregatedBoard;
};

export const aggregateOwnSnake = (tu) => {
  const state = store.getState();
  const ownId = state.p2p.id;
  const snake = state.snakes[ownId];
  const length = snakeHelpers.getSnakeLength(tu);
  const aggregate = {};

  let i = tu - (length - 1);

  while (i <= tu && snake.positions.byKey[i]) {
    boardHelpers.addCoordinatesMutate(aggregate, snake.positions.byKey[i], snake, ownId);
    i += 1;
  }

  return aggregate;
};

export const getInitialDisplayBoard = () => (
  aggregateBoards(constants.INITIAL_TU)
);

export const buildNextDisplayBoard = () => {
  const state = store.getState();
  const tu = state.info.tu;

  const newBoard = merge(aggregateBoards(tu), aggregateOwnSnake(tu));

  const snakesObj = helpers.deepClone(state.snakes);
  const snakeIds = Object.keys(snakesObj);
  const length = snakeHelpers.getSnakeLength(tu);

  let snake;
  let mostRecentTu;
  let next;

  // predict next moves, fill in missing data with predictions
  snakeIds.forEach((id) => {
    if (snakeHelpers.snakeIsAlive(id)) {
      snake = snakesObj[id];
      mostRecentTu = Number(snake.positions.byIndex[0]);

      // run once for all snakes, more for snakes with missing TUs
      while (mostRecentTu < tu) {
        // calculate next coordinates (predicted)
        next = snakeHelpers.calculateNextCoords(snake.direction, snake.positions.byKey[`${mostRecentTu}`]);

        mostRecentTu += 1;

        // add predicted coordinates to cloned snake object
        snake.positions.byKey[`${mostRecentTu}`] = next;
        snake.positions.byIndex.unshift(`${mostRecentTu}`);

        // add next position to newBoard if it is within range
        // (based on target TU and snake length)
        if (mostRecentTu <= tu && mostRecentTu > tu - length) {
          boardHelpers.addCoordinatesMutate(newBoard, next, snake, id);
        }
      }
    }
  });

  return newBoard;
};

