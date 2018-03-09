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

export const p2pGetPeerIdFromURL = id => ({
  id,
  type: actionTypes.P2P_GET_PEERID_FROM_URL,
});

export const p2pConnectionReady = id => ({
  id,
  type: actionTypes.P2P_CONNECTION_READY,
});

export const p2pUpdatePeerList = id => ({
  id,
  type: actionTypes.P2P_UPDATE_PEER_LIST,
});

export const p2pRemovePeerFromList = id => ({
  id,
  type: actionTypes.P2P_REMOVE_PEER_FROM_LIST,
});

export const p2pAddCloseListener = (connection, dispatch) => {
  connection.on('close', () => {
    console.log(`Removing peer: ${connection.peer}`);
    dispatch(p2pRemovePeerFromList(connection.peer));
  });
};

export const p2pConnectToNewPeers = (list, dispatch) => {
  list.forEach((peerId) => {
    if (store.getState().p2p.peers[peerId] || peerId === peer.id) {
      return;
    }

    const dataConnection = peer.connect(peerId);
    dataConnection.on('open', () => {
      dataConnection.on('data', (data) => {
      });

      dispatch(p2pUpdatePeerList(dataConnection.peer));
    });
    p2pAddCloseListener(dataConnection, dispatch);
  });
};

export const p2pConnectToKnownPeers = (dispatch) => {
  const peerIds = Object.keys(store.getState().p2p.peers);
  peerIds.forEach((peerId) => {
    if (peerId !== peer.id) {
      const dataConnection = peer.connect(peerId);
      dataConnection.on('open', () => {
        dataConnection.on('data', (data) => {
          p2pConnectToNewPeers(data, dispatch);
        });
      });
      p2pAddCloseListener(dataConnection, dispatch);
    }
  });
};

export const p2pInitialize = () => (
  (dispatch) => {
    peer = p2pHelpers.initializeOwnPeerObject()
      .on('error', (error) => {
        console.log(`PeerJS error: ${error}`);
      })
      .on('open', (id) => {
        console.log(`My peer ID is: ${id}`);
        dispatch(p2pConnectionReady(id));
        p2pConnectToKnownPeers(dispatch);
      })
      .on('connection', (dataConnection) => {
        dataConnection.on('open', () => {
          dataConnection.on('data', (data) => {
            p2pConnectToNewPeers(data, dispatch);
          });
          dispatch(p2pUpdatePeerList(dataConnection.peer));
          dataConnection.send(Object.keys(store.getState().p2p.peers));
        });
        p2pAddCloseListener(dataConnection, dispatch);
      });
  }
);
