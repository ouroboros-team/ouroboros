import store from '../store';
import * as snakeHelpers from '../snake/snakeHelpers';
import * as helpers from '../metaHelpers';
import * as constants from '../../constants';

export const addCoordinatesMutate = (board, coords, snake, snakeId) => {
  if (board[coords.row] === undefined) {
    board[coords.row] = {};
  }

  board[coords.row][coords.column] = {
    snake,
    id: snakeId,
  };
};

export const aggregateBoards = (lastTu) => {
  const snakesObj = helpers.deepClone(store.getState().snakes);
  const snakeIds = Object.keys(snakesObj);
  const length = snakeHelpers.getSnakeLength(lastTu);
  const aggregatedBoard = {};
  let snake = {};

  snakeIds.forEach((id) => {
    if (snakeHelpers.snakeIsAlive(id)) {
      snake = snakesObj[id];

      for (let i = (lastTu - length) + 1; i <= lastTu; i++) {
        // newer data overwrites older data, no collision checking yet
        if (snake.positions.byKey[i]) {
          addCoordinatesMutate(aggregatedBoard, snake.positions.byKey[i], snake, id);
        }
      }
    }
  });

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
          addCoordinatesMutate(newBoard, next, snake, id);
        }
      }
    }
  });

  return newBoard;
};
