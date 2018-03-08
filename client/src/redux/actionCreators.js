import * as actionTypes from './actionTypes';
import * as p2pHelpers from './p2p/p2pHelpers';

// info
export const incrementTu = () => ({
  type: actionTypes.INCREMENT_TU,
});


// snakes
export const changeSnakeDirection = (id, direction) => ({
  id,
  direction,
  type: actionTypes.CHANGE_SNAKE_DIRECTION,
});


// board
export const aggregateInitialBoard = () => ({
  type: actionTypes.AGGREGATE_INITIAL_BOARD,
});


// display board
export const getInitialDisplayBoard = () => ({
  type: actionTypes.GET_INITIAL_DISPLAY_BOARD,
});

export const getNextDisplayBoard = () => ({
  type: actionTypes.GET_NEXT_DISPLAY_BOARD,
});


// P2P
let peer;

export const p2pGetPeerIdFromURL = (id) => ({
  id,
  type: actionTypes.P2P_GET_PEERID_FROM_URL,
});

export const p2pInitialize = () => (
  (dispatch) => {
    peer = p2pHelpers.initializeOwnPeerObject()
      .on('open', (id) => {
        console.log(`My peer ID is: ${id}`);
        dispatch({
          id,
          type: actionTypes.P2P_CONNECTION_READY,
        });
      });
  }
);
