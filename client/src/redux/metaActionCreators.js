import store from './store';
import * as constants from '../constants';

import * as headSetActions from './headSet/headSetActionCreators';
import * as boardActions from './board/boardActionCreators';
import * as infoActions from './info/infoActionCreators';
import * as p2pActions from './p2p/p2pActionCreators';
import * as snakeActions from './snake/snakeActionCreators';

import * as snakeHelpers from './snake/snakeHelpers';
import * as p2pHelpers from './p2p/p2pHelpers';

export const handleTuTick = id => (
  (dispatch) => {
    // Only check collisions and broadcast data if snake is alive
    if (snakeHelpers.snakeIsAlive(id)) {
      // write/broadcast own snake position
      dispatch(snakeActions.writeOwnSnakePosition(id));
      // Check for collisions, if found, check for game over
      dispatch(snakeActions.checkForCollisions(id));
    } else {
      // if own snake is dead or have no snake,
      // fast-forward to match peers' TU
      dispatch(infoActions.fastForwardTu(id));
    }
    // kill snakes with too much latency
    dispatch(snakeActions.checkForLatentSnakes());
    // increment TU
    dispatch(infoActions.incrementTu());
    // increment game over delay, if delay 'started'
    if (store.getState().info.gameOverDelay > 0) {
      dispatch(infoActions.incrementGameOverDelay());
      dispatch(snakeActions.checkForGameOver());
    }
    // get next board
    dispatch(boardActions.getNextBoard());
  }
);

export const receiveSnakeData = (id, data) => (
  (dispatch) => {
    const gap = snakeHelpers.getTuGap(id, data);
    dispatch(snakeActions.handleUpdateSnakeData(id, data));
    dispatch(headSetActions.updateHeadSets(id, null, gap));
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
    dispatch(infoActions.resetStartingRows());
    dispatch(snakeActions.resetSnakeData());
    dispatch(boardActions.resetBoard());
    dispatch(headSetActions.resetHeadSets());
    dispatch(infoActions.setTu(0));
    dispatch(infoActions.resetWinner());
  }
);

export const declareWinner = peerId => (
  (dispatch) => {
    p2pActions.p2pBroadcastWinnerId(peerId);
    const username = p2pHelpers.getUsername(peerId);
    const result = username || constants.GAME_RESULT_TIE;
    dispatch(infoActions.updateWinner(result));
  }
);

export const confirmWinner = (peerId, dispatch) => {
  const peerSnake = store.getState().snakes[peerId];
  if (peerSnake.status === constants.SNAKE_STATUS_ALIVE) {
    dispatch(declareWinner(peerId));
  } else {
    dispatch(declareWinner());
  }
};

export const declareGameOver = currentWinnerId => (
  (dispatch) => {
    dispatch(p2pActions.p2pBroadcastGameStatus(constants.GAME_STATUS_POSTGAME));
    if (currentWinnerId) {
      window.setTimeout(confirmWinner, constants.GAME_OVER_DELAY * constants.LOOP_INTERVAL, currentWinnerId, dispatch);
    } else {
      dispatch(declareWinner());
    }
  }
);
