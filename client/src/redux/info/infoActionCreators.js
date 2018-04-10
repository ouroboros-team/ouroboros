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
    dispatch(updateGameStatus(newStatus));

    switch (newStatus) {
      case constants.GAME_STATUS_READY_TO_PLAY: {
        dispatch(headSetActions.updateHeadSets());
        break;
      }
      case constants.GAME_STATUS_PLAYING: {
        p2pActions.p2pBroadcastSnakeData();
        break;
      }
      case constants.GAME_STATUS_LOBBY: {
        dispatch(metaActions.resetGameData());
        break;
      }
      // case constants.GAME_STATUS_PREGAME:
      // case constants.GAME_STATUS_POSTGAME:
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
    const myId = id || state.p2p.id;
    let newTu;

    // relying on snakeIds[0] or snakeIds[1] to be sufficiently up to date
    if (snakeIds[0] !== myId) {
      newTu = snakes[snakeIds[0]].positions.newest;
    } else {
      newTu = snakes[snakeIds[1]].positions.newest;
    }

    if (newTu - oldTu > 5) {
      // fast-forward TU
      dispatch(setTu(newTu));
      return newTu;
    }

    return oldTu;
  }
);
