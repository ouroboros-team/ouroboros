import store from '../store';
import * as constants from '../../constants';

import * as actionTypes from '../actionTypes';
import * as headSetActions from '../headSet/headSetActionCreators';
import * as metaActions from '../metaActionCreators';

import * as snakeHelpers from '../snake/snakeHelpers';

export const incrementTu = () => ({
  type: actionTypes.INCREMENT_TU,
});

export const resetTu = () => ({
  type: actionTypes.RESET_TU,
});

export const updateAvailableRows = availableRows => ({
  availableRows,
  type: actionTypes.UPDATE_AVAILABLE_ROWS,
});

export const resetAvailableRows = () => ({
  type: actionTypes.RESET_AVAILABLE_ROWS,
});

export const updateGameStatus = status => ({
  status,
  type: actionTypes.UPDATE_GAME_STATUS,
});

export const updateWinner = winner => ({
  winner,
  type: actionTypes.UPDATE_WINNER,
});

export const resetWinner = () => ({
  type: actionTypes.RESET_WINNER,
});

export const setLivingSnakeCount = count => ({
  count,
  type: actionTypes.SET_LIVING_SNAKE_COUNT,
});

export const decrementLivingSnakeCount = () => ({
  type: actionTypes.DECREMENT_LIVING_SNAKE_COUNT,
});

export const resetLivingSnakeCount = () => ({
  type: actionTypes.RESET_LIVING_SNAKE_COUNT,
});

export const addToDeathBuffer = tu => ({
  tu,
  type: actionTypes.ADD_TO_DEATH_BUFFER,
});

export const removeFromDeathBuffer = tu => ({
  tu,
  type: actionTypes.REMOVE_FROM_DEATH_BUFFER,
});

export const resetDeathBuffer = () => ({
  type: actionTypes.RESET_DEATH_BUFFER,
});

export const addToGameOverBuffer = tu => ({
  tu,
  type: actionTypes.ADD_TO_GAME_OVER_BUFFER,
});

export const resetGameOverBuffer = () => ({
  type: actionTypes.RESET_GAME_OVER_BUFFER,
});

export const getAvailableRow = () => (
  (dispatch) => {
    const availableRows = [...store.getState().info.availableRows];
    const row = availableRows.pop();
    dispatch(updateAvailableRows(availableRows));
    return row;
  }
);

export const handleGameStatusChange = newStatus => (
  (dispatch) => {
    const oldStatus = store.getState().info.gameStatus;

    // do nothing if new status is same as old status
    if (oldStatus === newStatus) {
      return;
    }

    // only change game status when in proper sequence,
    // otherwise set game status to out of sync
    if (newStatus === constants.GAME_STATUS_LOBBY &&
      (oldStatus === constants.GAME_STATUS_POSTGAME || oldStatus === constants.GAME_STATUS_OUT_OF_SYNC)) {
      dispatch(updateGameStatus(newStatus));
      dispatch(metaActions.resetGameData());
    } else if (newStatus === constants.GAME_STATUS_PREGAME &&
      oldStatus === constants.GAME_STATUS_LOBBY) {
      dispatch(updateGameStatus(newStatus));
    } else if (newStatus === constants.GAME_STATUS_READY_TO_PLAY &&
      oldStatus === constants.GAME_STATUS_PREGAME) {
      dispatch(updateGameStatus(newStatus));
      dispatch(headSetActions.updateHeadSets());
    } else if (newStatus === constants.GAME_STATUS_PLAYING &&
      oldStatus === constants.GAME_STATUS_READY_TO_PLAY) {
      dispatch(updateGameStatus(newStatus));
      dispatch(setLivingSnakeCount(Object.keys(store.getState().snakes).length));
    } else if (newStatus === constants.GAME_STATUS_POSTGAME) {
      dispatch(updateGameStatus(newStatus));
      dispatch(updateWinner(snakeHelpers.getWinners()));
    } else {
      dispatch(updateGameStatus(constants.GAME_STATUS_OUT_OF_SYNC));
    }
  }
);

export const processDeathBuffer = () => (
  (dispatch) => {
    const state = store.getState();
    const tu = state.info.tu;
    const buffer = state.info.deathBuffer;

    if (buffer[tu]) {
      dispatch(decrementLivingSnakeCount());
      dispatch(removeFromDeathBuffer(tu));
    }
  }
);

export const processGameOverBuffer = () => (
  (dispatch) => {
    const state = store.getState();
    const tu = state.info.tu;
    const buffer = state.info.gameOverBuffer;

    if (buffer[tu]) {
      dispatch(handleGameStatusChange(constants.GAME_STATUS_POSTGAME));
    }
  }
);
