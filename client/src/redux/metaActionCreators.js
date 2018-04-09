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
      // check for collisions
      dispatch(snakeActions.checkForCollisions(id));
    } else {
      // if own snake is dead or have no snake,
      // broadcast own death
      p2pActions.p2pBroadcastOwnDeath();
      // fast-forward to match peers' TU
      dispatch(infoActions.fastForwardTu(id));
    }
    // kill snakes with too much latency
    dispatch(snakeActions.checkForLatentSnakes());
    // increment TU
    dispatch(infoActions.incrementTu());
    // get next board
    dispatch(boardActions.getNextBoard());
  }
);

export const receiveSnakeData = (id, data) => (
  (dispatch) => {
    const gap = snakeHelpers.getTuGap(id, data);
    dispatch(snakeActions.updateSnakeData(id, data));
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
    dispatch(infoActions.resetAvailableRows());
    dispatch(snakeActions.resetSnakeData());
    dispatch(boardActions.resetBoard());
    dispatch(headSetActions.resetHeadSets());
    dispatch(infoActions.setTu(0));
    dispatch(infoActions.resetWinner());
    dispatch(infoActions.resetLivingSnakeCount());
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

export const declareGameOver = currentWinnerId => (
  (dispatch) => {
    dispatch(p2pActions.p2pBroadcastGameStatus(constants.GAME_STATUS_POSTGAME));
    if (currentWinnerId) {
      // if we think we know the winner, wait a bit for new data from peers
      // and then confirm that this snake is still alive
      window.setTimeout(() => {
        if (snakeHelpers.snakeIsAlive(currentWinnerId)) {
          // if alive, this snake is the winner
          dispatch(declareWinner(currentWinnerId));
        } else {
          // if dead, declare a tie
          dispatch(declareWinner());
        }
      }, constants.GAME_OVER_DELAY * constants.LOOP_INTERVAL);
    } else {
      // if it was a tie, declare the tie
      dispatch(declareWinner());
    }
  }
);

export const handleSnakeDeath = (id, tuOfDeath) => (
  (dispatch) => {
    if (id === p2pHelpers.getOwnId()) {
      // broadcast own death to peers
      p2pActions.p2pBroadcastOwnDeath(tuOfDeath);
    } else if (snakeHelpers.snakeIsAlive(id)) {
      dispatch(snakeActions.handleSetTuOfDeath(id, tuOfDeath));
      dispatch(infoActions.decrementLivingSnakeCount());

      if (snakeHelpers.checkForGameOver()) {
        dispatch(declareGameOver());
      }
    }
  }
);
