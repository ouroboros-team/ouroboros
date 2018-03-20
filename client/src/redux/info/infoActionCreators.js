import random from 'lodash/random';

import store from '../store';
import * as constants from '../../constants';

import * as actionTypes from '../actionTypes';
import * as headSetActions from '../headSet/headSetActionCreators';
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

export const updateWinner = winner => ({
  winner,
  type: actionTypes.UPDATE_WINNER,
});

export const resetWinner = () => ({
  type: actionTypes.RESET_WINNER,
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
        dispatch(headSetActions.updateHeadSets());
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

export const fastForwardTu = id => (
  (dispatch) => {
    const state = store.getState();
    const snakes = state.snakes;
    const snakeIds = Object.keys(snakes);
    const oldTu = state.info.tu;
    let newTu;

    // relying on snakeIds[0] or snakeIds[1] to be sufficiently up to date
    if (snakeIds[0] !== id) {
      newTu = Number(snakes[snakeIds[0]].positions.byIndex[0]);
    } else {
      newTu = Number(snakes[snakeIds[1]].positions.byIndex[0]);
    }

    if (newTu - oldTu > 5) {
      // fast-forward TU
      dispatch(setTu(newTu));
    }
  }
);
