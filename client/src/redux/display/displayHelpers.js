import merge from 'lodash/merge';

import store from '../store';
import * as snakeHelpers from '../snake/snakeHelpers';
import * as constants from '../../constants';

export const aggregateBoards = (lastTu) => {
  const state = store.getState();
  const boards = state.boards;
  const length = snakeHelpers.getSnakeLength(lastTu);
  let aggregatedBoard = {};

  let i = lastTu - (length - 1);
  while (i <= lastTu) {
    aggregatedBoard = merge(aggregatedBoard, boards[i]);
    i += 1;
  }

  return aggregatedBoard;
};

export const getInitialDisplayBoard = () => (
  aggregateBoards(constants.INITIAL_TU)
);
