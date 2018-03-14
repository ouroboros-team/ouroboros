import * as actionTypes from '../actionTypes';

export const getInitialDisplayBoard = () => ({
  type: actionTypes.GET_INITIAL_DISPLAY_BOARD,
});

export const getNextDisplayBoard = () => ({
  type: actionTypes.GET_NEXT_DISPLAY_BOARD,
});

export const resetDisplayData = () => ({
  type: actionTypes.RESET_DISPLAY_DATA,
});
