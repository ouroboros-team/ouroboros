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

export const aggregateInitialBoard = () => {
  const board = {};
  const snakesObj = store.getState().snakes;
  const snakeIds = Object.keys(snakesObj);
  let row;
  let col;

  snakeIds.forEach((id) => {
    snakesObj[id].body.forEach((coords) => {
      row = coords.row;
      col = coords.column;

      if (board[row] === undefined) {
        board[row] = {};
      }

      board[row][col] = {
        id,
        snake: snakesObj[id],
      };
    });
  });

  return board;
};
