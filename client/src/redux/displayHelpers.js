import store from './store';
import * as helpers from './metaHelpers';
import * as constants from '../constants';

export const dequeueTailMutate = (snake) => {
  const tail = snake.body.pop();
  snake.history.unshift(tail);
  return tail;
};

export const enqueueHeadMutate = (snake, nextPosition) => {
  snake.body.unshift(nextPosition);
  return nextPosition;
};

export const addCoordinatesMutate = (board, coords, snake, snakeId) => {
  if (board[coords.row] === undefined) {
    board[coords.row] = {};
  }

  board[coords.row][coords.column] = {
    snake,
    id: snakeId,
  };
};

export const removeCoordinatesMutate = (board, coords) => {
  if (board[coords.row] && board[coords.row][coords.column]) {
    delete board[coords.row][coords.column];
  }
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

export const getNextDisplayBoard = () => {
  const state = store.getState();

  // deep clone allows free mutation
  const newBoard = helpers.deepClone(state.board);
  const snakesObj = helpers.deepClone(state.snakes);

  const snakeIds = Object.keys(snakesObj);
  const tu = state.info.tu;

  let snake;
  let tail;
  let next;

  snakeIds.forEach((id) => {
    snake = snakesObj[id];

    // run once for all snakes, more for snakes with missing TUs
    while (snake.body[0].tu <= tu) {
      // remove tail from cloned snake object
      tail = dequeueTailMutate(snake);

      // remove tail from newBoard
      removeCoordinatesMutate(newBoard, tail);

      // calculate next coordinates (predicted)
      next = calculateNextCoords(snake.direction, snake.body[0]);

      // add predicted coordinates to cloned snake object
      enqueueHeadMutate(snake, next);

      // add next position to newBoard
      addCoordinatesMutate(newBoard, next, snake, id);
    }
  });

  return newBoard;
};
