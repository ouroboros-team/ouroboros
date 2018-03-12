import store from '../store';

// rows, columns as keys
// const aggregatedBoard = {
//   4: {
//     6: snakes[0],
//     7: snakes[0],
//   },
//   5: {
//     5: snakes[0],
//     6: snakes[0],
//     7: snakes[1],
//     8: snakes[1],
//     9: snakes[1],
//     10: snakes[1],
//   }
// };

export const addCoordinatesMutate = (board, coords, snake, snakeId) => {
  if (board[coords.row] === undefined) {
    board[coords.row] = {};
  }

  board[coords.row][coords.column] = {
    snake,
    id: snakeId,
  };
};

export const aggregateBoards = (boards, id, snake = undefined) => {
  if (!snake) {
    snake = store.getState().snakes[id];
  }

  snake.positions.forEach((coords) => {
    if (boards[coords.tu] === undefined) {
      boards[coords.tu] = {};
    }

    addCoordinatesMutate(boards[coords.tu], coords, snake, id);
  });
};

export const aggregateAllBoards = (boards) => {
  const snakesObj = store.getState().snakes;
  const snakeIds = Object.keys(snakesObj);

  snakeIds.forEach((id) => {
    aggregateBoards(boards, id, snakesObj[id]);
  });

  return boards;
};
