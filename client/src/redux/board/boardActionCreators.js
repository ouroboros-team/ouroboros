import * as actionTypes from '../actionTypes';

export const getInitialBoard = () => ({
  type: actionTypes.GET_INITIAL_BOARD,
});

export const getNextBoard = () => ({
  type: actionTypes.GET_NEXT_BOARD,
});

export const resetBoard = () => ({
  type: actionTypes.RESET_BOARD,
});
