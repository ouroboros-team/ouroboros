import store from '../store';
import * as constants from '../../constants';

import * as actionTypes from '../actionTypes';
import * as headSetActions from '../headSet/headSetActionCreators';
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

export const removeFromGameOverBuffer = tu => ({
  tu,
  type: actionTypes.REMOVE_FROM_GAME_OVER_BUFFER,
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
    dispatch(updateGameStatus(newStatus));

    switch (newStatus) {
      case constants.GAME_STATUS_READY_TO_PLAY: {
        dispatch(headSetActions.updateHeadSets());
        break;
      }
      case constants.GAME_STATUS_PLAYING: {
        // set number of living snakes
        dispatch(setLivingSnakeCount(Object.keys(store.getState().snakes).length));
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
      newTu = snakes[snakeIds[0]].positions.byIndex[0];
    } else {
      newTu = snakes[snakeIds[1]].positions.byIndex[0];
    }

    if (newTu - oldTu > 5) {
      // fast-forward TU
      dispatch(setTu(newTu));
      return newTu;
    }

    return oldTu;
  }
);
