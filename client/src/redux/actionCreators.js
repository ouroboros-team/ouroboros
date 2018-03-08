import * as actionTypes from './actionTypes';
import * as p2pHelpers from './p2p/p2pHelpers';
import store from './store';

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
const connections = [];

export const p2pGetPeerIdFromURL = id => ({
  id,
  type: actionTypes.P2P_GET_PEERID_FROM_URL,
});

export const p2pConnectionReady = id => ({
  id,
  type: actionTypes.P2P_CONNECTION_READY,
});

export const p2pConnectToKnownPeers = () => {
  const peers = store.getState().p2p.peers;
  peers.forEach((peerId) => {
    if (peerId !== peer.id) {
      const conn = peer.connect(peerId);
      conn.on('open', () => {
        conn.on('data', (data) => {
          console.log(`Connection data: ${data}`);
        });
        connections.push(conn);
      });
    }
  });
};

export const p2pUpdatePeerList = id => ({
  id,
  type: actionTypes.P2P_UPDATE_PEER_LIST,
});

export const p2pInitialize = () => (
  (dispatch) => {
    peer = p2pHelpers.initializeOwnPeerObject()
      .on('error', (error) => {
        console.log(`PeerJS error: ${error}`);
      })
      .on('open', (id) => {
        console.log(`My peer ID is: ${id}`);
        dispatch(p2pConnectionReady(id));
        p2pConnectToKnownPeers();
      })
      .on('connection', (dataConnection) => {
        dataConnection.on('open', () => {
          dataConnection.on('data', (data) => {
            console.log(`Connection data: ${data}`);
          });
          dispatch(p2pUpdatePeerList(dataConnection.peer));
          connections.push(dataConnection);
          dataConnection.send(store.getState().p2p.peers);
          console.log(`Data conn open. New list of peers: ${store.getState().p2p.peers}`);
        });
      });
  }
);
