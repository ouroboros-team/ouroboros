import * as actionTypes from '../actionTypes';

export const updateHeadSets = (id, snake) => ({
  id, // if present, update for only this snake; if absent, update all
  snake,
  type: actionTypes.UPDATE_HEAD_SETS,
});

export const resetHeadSets = () => ({
  type: actionTypes.RESET_HEAD_SETS,
});
