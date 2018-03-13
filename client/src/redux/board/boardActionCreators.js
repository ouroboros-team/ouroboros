import * as actionTypes from '../actionTypes';

export const aggregateBoards = (id = undefined) => ({
  id,
  type: actionTypes.AGGREGATE_BOARDS,
});
