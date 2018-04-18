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

export const updateOwnStartingRow = startingRow => ({
  startingRow,
  type: actionTypes.UPDATE_OWN_STARTING_ROW,
});

export const resetOwnStartingRow = () => ({
  type: actionTypes.RESET_OWN_STARTING_ROW,
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
    const availableRows = [ ...store.getState().info.availableRows ];
    const row = availableRows.pop();
    dispatch(updateAvailableRows(availableRows));
    return row;
  }
);

export const handleGameStatusChange = newStatus => (
  (dispatch) => {
    const state = store.getState();
    const oldStatus = state.info.gameStatus;

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
      dispatch(setLivingSnakeCount(Object.keys(state.snakes).length));
    } else if (newStatus === constants.GAME_STATUS_POSTGAME) {
      let winners;
      if (oldStatus !== constants.GAME_STATUS_PLAYING) {
        // no winner will be given in postgame if you are out of sync
        winners = constants.GAME_STATUS_OUT_OF_SYNC;
      } else {
        winners = snakeHelpers.getWinners();
      }
      dispatch(updateGameStatus(newStatus));
      dispatch(updateWinner(winners));
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
      let n = buffer[tu];

      while (n > 0) {
        dispatch(decrementLivingSnakeCount());
        n -= 1;
      }

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
