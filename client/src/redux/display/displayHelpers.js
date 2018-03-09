import store from '../store';
import * as boardHelpers from '../board/boardHelpers';
import * as helpers from '../metaHelpers';
import * as constants from '../../constants';

export const dequeueTailMutate = (snake) => {
  const tail = snake.body.pop();
  snake.history.unshift(tail);
  return tail;
};

export const enqueueHeadMutate = (snake, nextPosition) => {
  snake.body.unshift(nextPosition);
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

export const getNextDisplayBoard = () => {
  const state = store.getState();
  const tu = state.info.tu;

  // deep clone allows free mutation
  const newBoard = helpers.deepClone(state.boards[tu - 1] || {});
  const snakesObj = helpers.deepClone(state.snakes);

  const snakeIds = Object.keys(snakesObj);

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
      boardHelpers.removeCoordinatesMutate(newBoard, tail);

      // calculate next coordinates (predicted)
      next = calculateNextCoords(snake.direction, snake.body[0]);

      // add predicted coordinates to cloned snake object
      enqueueHeadMutate(snake, next);

      // add next position to newBoard
      boardHelpers.addCoordinatesMutate(newBoard, next, snake, id);
    }
  });

  return newBoard;
};
