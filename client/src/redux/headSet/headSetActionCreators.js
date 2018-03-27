import * as actionTypes from '../actionTypes';

export const updateHeadSets = (id, snake, gap) => ({
  id, // if present, update for only this snake; if absent, update all
  snake,
  gap,
  type: actionTypes.UPDATE_HEAD_SETS,
});

export const patchHeadSet = (tu, sqNum, id) => ({
  tu,
  sqNum,
  id,
  type: actionTypes.PATCH_HEAD_SET,
});

export const resetHeadSets = () => ({
  type: actionTypes.RESET_HEAD_SETS,
});
