import store from '../store';
import * as p2pHelpers from '../p2p/p2pHelpers';

// tus, rows, columns as keys

export const addCoordinatesMutate = (headSet, coords, snake, snakeId) => {
  if (headSet[coords.row] === undefined) {
    headSet[coords.row] = {};
  }

  headSet[coords.row][coords.column] = {
    snake,
    id: snakeId,
  };
};

export const updateHeadSets = (headSets, id, snakeData = undefined) => {
  // don't aggregate for own snake
  if (id === p2pHelpers.getOwnId()) {
    return;
  }

  let snake = snakeData;

  if (!snake) {
    snake = store.getState().snakes[id];
  }

  snake.positions.byIndex.forEach((key) => {
    if (headSets[key] === undefined) {
      headSets[key] = {};
    }

    addCoordinatesMutate(headSets[key], snake.positions.byKey[key], snake, id);
  });
};

export const updateAllHeadSets = (headSets) => {
  const snakesObj = store.getState().snakes;
  const snakeIds = Object.keys(snakesObj);

  snakeIds.forEach((id) => {
    updateHeadSets(headSets, id, snakesObj[id]);
  });

  return headSets;
};
