import store from '../store';

import * as headSetHelpers from '../headSet/headSetHelpers';
import * as snakeHelpers from '../snake/snakeHelpers';
import * as helpers from '../metaHelpers';

import * as constants from '../../constants';

export const aggregateBoards = (mostRecentTu) => {
  const state = store.getState();
  const headSets = state.headSets.byKey;
  const length = snakeHelpers.getSnakeLength(mostRecentTu);
  let aggregatedBoard = {};

  let i = mostRecentTu - (length - 1);
  while (i <= mostRecentTu) {
    aggregatedBoard = { ...aggregatedBoard, ...headSets[i] };
    i += 1;
  }

  return aggregatedBoard;
};

export const aggregateOwnSnake = (mostRecentTu) => {
  const state = store.getState();
  const ownId = state.p2p.id;
  const snake = state.snakes[ownId];
  const aggregate = {};

  // return empty object if own snake is dead
  if (snake.status === constants.SNAKE_STATUS_DEAD) {
    return aggregate;
  }

  const length = snakeHelpers.getSnakeLength(mostRecentTu);

  let i = mostRecentTu - (length - 1);

  while (i <= mostRecentTu && snake.positions.byKey[i]) {
    headSetHelpers.addCoordinatesMutate(aggregate, snake.positions.byKey[i], snake, ownId);
    i += 1;
  }

  return aggregate;
};

export const getInitialBoard = () => (
  { ...aggregateBoards(constants.INITIAL_TU), ...aggregateOwnSnake(constants.INITIAL_TU) }
);

export const buildNextBoard = () => {
  const state = store.getState();
  const tu = state.info.tu;

  const newBoard = { ...aggregateBoards(tu), ...aggregateOwnSnake(tu) };

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
      mostRecentTu = snake.positions.byIndex[0];

      // run once for all snakes, more for snakes with missing TUs
      while (mostRecentTu < tu) {
        // calculate next coordinates (predicted)
        next = snakeHelpers.calculateNextCoords(snake.direction, snake.positions.byKey[mostRecentTu]);

        mostRecentTu += 1;

        // add predicted coordinates to cloned snake object
        snake.positions.byKey[mostRecentTu] = next;
        snake.positions.byIndex.unshift(mostRecentTu);

        // add next position to newBoard if it is within range
        // (based on target TU and snake length)
        if (mostRecentTu <= tu && mostRecentTu > tu - length) {
          headSetHelpers.addCoordinatesMutate(newBoard, next, snake, id);
        }
      }
    }
  });

  return newBoard;
};

