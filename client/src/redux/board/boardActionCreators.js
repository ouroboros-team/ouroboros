import * as actionTypes from '../actionTypes';

export const updateBoards = (id, snake) => ({
  id, // if present, update for only this snake; if absent, update all
  snake,
  type: actionTypes.UPDATE_BOARDS,
});

export const resetBoards = () => ({
  type: actionTypes.RESET_BOARDS,
});
