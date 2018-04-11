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
    // process death buffer (decrement living snakes if needed)
    dispatch(infoActions.processDeathBuffer());
    // process game over buffer
    dispatch(infoActions.processGameOverBuffer());
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
    dispatch(snakeActions.resetSnakeData());
    dispatch(boardActions.resetBoard());
    dispatch(headSetActions.resetHeadSets());
    dispatch(infoActions.resetAvailableRows());
    dispatch(infoActions.setTu(0));
    dispatch(infoActions.resetWinner());
    dispatch(infoActions.resetLivingSnakeCount());
    dispatch(infoActions.resetDeathBuffer());
    dispatch(infoActions.resetGameOverBuffer());
  }
);

export const handleSnakeDeath = (id, tuOfDeath) => (
  (dispatch) => {
    // do nothing if snake is already dead
    if (!snakeHelpers.snakeIsAlive(id)) {
      return;
    }

    dispatch(snakeActions.setTuOfDeath(id, tuOfDeath));

    const tu = store.getState().info.tu;

    if (id === p2pHelpers.getOwnId()) {
      // broadcast own death to peers
      p2pActions.p2pBroadcastOwnDeath(tuOfDeath);

      dispatch(infoActions.decrementLivingSnakeCount());
    } else if (tuOfDeath <= tu) {
      dispatch(infoActions.decrementLivingSnakeCount());
    } else {
      dispatch(infoActions.addToDeathBuffer(tuOfDeath));
    }

    if (snakeHelpers.checkForGameOver()) {
      window.setTimeout(() => {
        p2pActions.p2pBroadcastGameOver(tu);
      }, constants.GAME_OVER_DELAY * constants.LOOP_INTERVAL);
    }
  }
);

export const receiveGameOver = tuOfGameOver => (
  (dispatch) => {
    const tu = store.getState().info.tu;
    if (tuOfGameOver <= tu) {
      dispatch(infoActions.handleGameStatusChange(constants.GAME_STATUS_POSTGAME));
    } else {
      dispatch(infoActions.addToGameOverBuffer(tuOfGameOver));
    }
  }
);
