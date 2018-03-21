import store from '../store';

import * as p2pHelpers from '../p2p/p2pHelpers';
import * as snakeHelpers from '../snake/snakeHelpers';

import * as constants from '../../constants';

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

export const updateSnakeHeadSets = (headSets, id, snakeData, gap) => {
  // don't aggregate for own snake
  if (id === p2pHelpers.getOwnId()) {
    return;
  }

  let snake = snakeData;

  if (!snake) {
    snake = store.getState().snakes[id];
  }

  const mostRecentTu = snake.positions.byIndex[0];
  let tuCounter;

  if (gap && gap > 0) {
    // if gap is given, process only TUs in gap
    tuCounter = mostRecentTu - (gap - 1);
  } else {
    // if no gap is given, process all TUs, starting with the earliest
    tuCounter = snake.positions.byIndex[snake.positions.byIndex.length - 1];
  }

  while (tuCounter <= mostRecentTu) {
    if (headSets.byKey[tuCounter] === undefined) {
      headSets.byKey[tuCounter] = {};
      headSets.byIndex.unshift(tuCounter);
    }

    addCoordinatesMutate(headSets.byKey[tuCounter], snake.positions.byKey[tuCounter], snake, id);
    tuCounter += 1;
  }

  // purge extra head sets
  const keepCount = snakeHelpers.getSnakeLength(mostRecentTu) + constants.HISTORY_LENGTH;
  let toRemove;

  while (headSets.byIndex.length > keepCount) {
    toRemove = headSets.byIndex.pop();
    delete headSets.byKey[toRemove];
  }
};

export const updateAllHeadSets = (headSets) => {
  const snakesObj = store.getState().snakes;
  const snakeIds = Object.keys(snakesObj);

  snakeIds.forEach((id) => {
    updateSnakeHeadSets(headSets, id, snakesObj[id]);
  });

  return headSets;
};
