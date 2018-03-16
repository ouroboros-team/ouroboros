import store from './store';
import * as constants from '../constants';

import * as displayActions from './display/displayActionCreators';
import * as infoActions from './info/infoActionCreators';
import * as p2pActions from './p2p/p2pActionCreators';
import * as snakeActions from './snake/snakeActionCreators';
import * as snakeHelpers from './snake/snakeHelpers';

export const handleTuTick = id => (
  (dispatch) => {
    // Only check collisions/broadcast data if snake is alive
    if (snakeHelpers.snakeIsAlive(id)) {
      // Check for collisions
      dispatch(snakeActions.checkForCollisions(id));
      // write/broadcast own snake position
      dispatch(snakeActions.writeOwnSnakePosition(id));
    }
    // increment TU
    dispatch(infoActions.incrementTu());
    // get next display board
    dispatch(displayActions.getNextDisplayBoard());
  }
);

export const receiveSnakeData = (id, data) => (
  (dispatch) => {
    if (data.status === constants.SNAKE_STATUS_DEAD) {
      dispatch(snakeActions.changeSnakeStatus(id, data.status));
    } else {
      dispatch(snakeActions.updateSnakeData(id, data));
    }
  }
);

export const checkReadiness = () => (
  (dispatch) => {
    const state = store.getState();
    if (state.info.gameStatus !== constants.GAME_STATUS_PREGAME) {
      return;
    }
    const peerList = Object.keys(state.p2p.peers);
    const snakeList = Object.keys(state.snakes);
    if (peerList.length === snakeList.length) {
      dispatch(p2pActions.p2pBroadcastGameStatus(constants.GAME_STATUS_READY_TO_PLAY));
    }
  }
);

export const resetGameData = () => (
  (dispatch) => {
    dispatch(snakeActions.resetSnakeData());
    dispatch(displayActions.resetDisplayData());
  }
);
