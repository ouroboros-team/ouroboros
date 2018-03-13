import * as actionTypes from '../actionTypes';

export const aggregateBoards = id => ({
  id,
  type: actionTypes.AGGREGATE_BOARDS,
});
