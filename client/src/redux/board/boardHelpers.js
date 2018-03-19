import store from '../store';

// tus, rows, columns as keys

export const addCoordinatesMutate = (board, coords, snake, snakeId) => {
  if (board[coords.row] === undefined) {
    board[coords.row] = {};
  }

  board[coords.row][coords.column] = {
    snake,
    id: snakeId,
  };
};

export const updateBoards = (boards, id, snakeData = undefined) => {
  let snake = snakeData;
  if (!snake) {
    snake = store.getState().snakes[id];
  }

  snake.positions.byIndex.forEach((key) => {
    if (boards[key] === undefined) {
      boards[key] = {};
    }

    addCoordinatesMutate(boards[key], snake.positions.byKey[key], snake, id);
  });
};

export const updateAllBoards = (boards) => {
  const snakesObj = store.getState().snakes;
  const snakeIds = Object.keys(snakesObj);

  snakeIds.forEach((id) => {
    updateBoards(boards, id, snakesObj[id]);
  });

  return boards;
};
