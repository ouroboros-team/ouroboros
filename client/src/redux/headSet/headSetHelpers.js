import store from '../store';

import * as p2pHelpers from '../p2p/p2pHelpers';
import * as snakeHelpers from '../snake/snakeHelpers';

import * as constants from '../../constants';

// tus, rows, columns as keys

export const coordsToSquareNumber = coords => (
  (coords.row * constants.GRID_SIZE) + coords.column
);

export const addCoordinatesMutate = (headSet, coords, snake, id) => {
  headSet[coordsToSquareNumber(coords)] = {
    snake,
    id,
  };
};

export const patchHeadSetMutate = (headSets, tu, sqNum, id) => {
  // don't patch if out of current TU range
  if (tu < headSets.oldest || tu > headSets.newest) {
    return;
  }

  const snakes = store.getState().snakes;

  if (headSets.byKey[tu][sqNum] && headSets.byKey[tu][sqNum].id !== id) {
    headSets.byKey[tu][sqNum] = {
      snake: snakes[id],
      id,
    };
  }
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

  const mostRecentTu = snake.positions.newest;
  let tuCounter;

  if (gap && gap > 0) {
    // if gap is given, process only TUs in gap
    tuCounter = mostRecentTu - (gap - 1);
  } else {
    // if no gap is given, process all TUs, starting with the earliest
    tuCounter = snake.positions.oldest;
  }

  // add head sets in range, don't add old ones that have already been purged
  while (tuCounter <= mostRecentTu && tuCounter >= headSets.oldest) {
    if (headSets.byKey[tuCounter] === undefined) {
      headSets.byKey[tuCounter] = {};

      // update newest if needed
      if (tuCounter > headSets.newest) {
        headSets.newest = tuCounter;
      }
    }

    addCoordinatesMutate(headSets.byKey[tuCounter], snake.positions.byKey[tuCounter], snake, id);
    tuCounter += 1;
  }

  // purge extra head sets
  const keepCount = snakeHelpers.getSnakeLength(mostRecentTu) + constants.HISTORY_LENGTH;
  let toRemove;

  while (headSets.newest - headSets.oldest > keepCount) {
    toRemove = headSets.oldest;
    delete headSets.byKey[toRemove];
    headSets.oldest += 1;
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
