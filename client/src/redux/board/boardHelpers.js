import cloneDeep from 'lodash/cloneDeep';

import store from '../store';

import * as headSetHelpers from '../headSet/headSetHelpers';
import * as snakeHelpers from '../snake/snakeHelpers';

import * as constants from '../../constants';

export const aggregateBoard = (mostRecentTu) => {
  const state = store.getState();
  const headSets = state.headSets.byKey;
  const length = snakeHelpers.getSnakeLength(mostRecentTu);
  let board = {};

  let i = mostRecentTu - (length - 1);
  while (i <= mostRecentTu) {
    board = { ...board, ...headSets[i] };
    i += 1;
  }

  return board;
};

export const aggregateOwnSnake = (mostRecentTu, excludeHead = false) => {
  const state = store.getState();
  const ownId = state.p2p.id;
  const snake = state.snakes[ownId];
  const aggregate = {};

  // return empty object if own snake is dead
  if (!snakeHelpers.snakeIsAlive(ownId)) {
    return aggregate;
  }

  const length = snakeHelpers.getSnakeLength(mostRecentTu);

  let tuCounter = mostRecentTu - (length - 1);
  const lastTu = excludeHead ? mostRecentTu - 1 : mostRecentTu;

  while (tuCounter <= lastTu && snake.positions.byKey[tuCounter]) {
    headSetHelpers.addCoordinatesMutate(aggregate, snake.positions.byKey[tuCounter], ownId, snake.styleId);
    tuCounter += 1;
  }

  return aggregate;
};

export const getInitialBoard = () => (
  { ...aggregateBoard(constants.INITIAL_TU), ...aggregateOwnSnake(constants.INITIAL_TU) }
);

export const buildNextBoard = () => {
  const state = store.getState();
  const tu = state.info.tu;

  const newBoard = { ...aggregateBoard(tu), ...aggregateOwnSnake(tu) };

  const snakesObj = cloneDeep(state.snakes);
  const snakeIds = Object.keys(snakesObj);
  const length = snakeHelpers.getSnakeLength(tu);

  let snake;
  let mostRecentTu;
  let next;

  // predict next moves, fill in missing data with predictions
  snakeIds.forEach((id) => {
    if (snakeHelpers.snakeIsAlive(id)) {
      snake = snakesObj[id];
      mostRecentTu = snake.positions.newest;

      // run once for all snakes, more for snakes with missing TUs
      while (mostRecentTu < tu) {
        // calculate next coordinates (predicted)
        next = snakeHelpers.calculateNextCoords(snake.direction, snake.positions.byKey[mostRecentTu]);

        mostRecentTu += 1;

        // add predicted coordinates to cloned snake object
        snake.positions.byKey[mostRecentTu] = next;
        snake.positions.newest = mostRecentTu;

        // add next position to newBoard if it is within range
        // (based on target TU and snake length)
        if (mostRecentTu <= tu && mostRecentTu > tu - length) {
          headSetHelpers.addCoordinatesMutate(newBoard, next, id, snake.styleId);
        }
      }
    }
  });

  return newBoard;
};

