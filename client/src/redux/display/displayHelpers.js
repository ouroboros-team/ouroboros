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
