import random from 'lodash/random';

import store from '../store';
import * as constants from '../../constants';

import * as actionTypes from '../actionTypes';
import * as p2pActions from '../p2p/p2pActionCreators';
import * as metaActions from '../metaActionCreators';

export const incrementTu = () => ({
  type: actionTypes.INCREMENT_TU,
});

export const setTu = tu => ({
  tu,
  type: actionTypes.SET_TU,
});

export const updateStartingRows = row => ({
  row,
  type: actionTypes.UPDATE_STARTING_ROWS,
});

export const resetStartingRows = () => ({
  type: actionTypes.RESET_STARTING_ROWS,
});

export const updateGameStatus = status => ({
  status,
  type: actionTypes.UPDATE_GAME_STATUS,
});

export const randomUniqueRow = () => (
  (dispatch) => {
    const rowsUsed = store.getState().info.startingRows;

    let row = random(0, constants.GRID_SIZE - 1);

    while (rowsUsed.includes(row)) {
      row = random(0, constants.GRID_SIZE - 1);
    }

    dispatch(updateStartingRows(row));
    return row;
  }
);

export const handleGameStatusChange = newStatus => (
  (dispatch) => {
    dispatch(updateGameStatus(newStatus));

    switch (newStatus) {
      case constants.GAME_STATUS_PREGAME: {
        break;
      }
      case constants.GAME_STATUS_READY_TO_PLAY: {
        break;
      }
      case constants.GAME_STATUS_PLAYING: {
        p2pActions.p2pBroadcastSnakeData();
        break;
      }
      case constants.GAME_STATUS_POSTGAME: {
        break;
      }
      case constants.GAME_STATUS_LOBBY: {
        dispatch(metaActions.resetGameData());
        break;
      }
      default: {
        break;
      }
    }
  }
);
