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
      // if own snake is dead, broadcast own death
      p2pActions.p2pBroadcastOwnDeath();
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
    dispatch(headSetActions.updateHeadSets(id, gap));
  }
);

export const resetGameData = () => (
  (dispatch) => {
    dispatch(snakeActions.resetSnakeData());
    dispatch(boardActions.resetBoard());
    dispatch(headSetActions.resetHeadSets());
    dispatch(infoActions.resetAvailableRows());
    dispatch(infoActions.resetTu());
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

    const state = store.getState();
    const tu = state.info.tu;
    const status = state.info.gameStatus;

    if (id === p2pHelpers.getOwnId()) {
      // broadcast own death to peers
      p2pActions.p2pBroadcastOwnDeath(tuOfDeath);

      dispatch(infoActions.decrementLivingSnakeCount());
    } else if (tuOfDeath <= tu || status === constants.GAME_STATUS_OUT_OF_SYNC) {
      dispatch(infoActions.decrementLivingSnakeCount());
    } else {
      dispatch(infoActions.addToDeathBuffer(tuOfDeath));
    }

    if (snakeHelpers.checkForGameOver()) {
      window.setTimeout(() => {
        dispatch(infoActions.handleGameStatusChange(constants.GAME_STATUS_POSTGAME));
        p2pActions.p2pBroadcastGameOver(tu);
      }, constants.GAME_OVER_DELAY * constants.LOOP_INTERVAL);
    }
  }
);

export const receiveGameOver = tuOfGameOver => (
  (dispatch) => {
    const state = store.getState();
    const tu = state.info.tu;
    const status = state.info.gameStatus;

    if (tuOfGameOver <= tu || status === constants.GAME_STATUS_OUT_OF_SYNC) {
      dispatch(infoActions.handleGameStatusChange(constants.GAME_STATUS_POSTGAME));
    } else {
      dispatch(infoActions.addToGameOverBuffer(tuOfGameOver));
    }
  }
);
