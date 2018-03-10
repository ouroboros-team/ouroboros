import store from './store';
import * as actionTypes from './actionTypes';
import * as p2pHelpers from './p2p/p2pHelpers';
import * as snakeHelpers from './snake/snakeHelpers';
import * as constants from '../constants';

// info
export const incrementTu = () => ({
  type: actionTypes.INCREMENT_TU,
});

export const updateGameStatus = status => ({
  status,
  type: actionTypes.UPDATE_GAME_STATUS,
});


// snakes
export const changeSnakeDirection = (id, direction) => ({
  id,
  direction,
  type: actionTypes.CHANGE_SNAKE_DIRECTION,
});

export const updatePeerSnakeData = (id, data) => ({
  id,
  data,
  type: actionTypes.UPDATE_PEER_SNAKE_DATA,
});

export const addNewSnake = (id, positions = []) => ({
  id,
  positions,
  type: actionTypes.ADD_NEW_SNAKE,
});

export const initializeOwnSnake = id => (
  (dispatch) => {
    const randomStartPositions = snakeHelpers.randomizeStartPosition();
    dispatch(addNewSnake(id, randomStartPositions));
  }
);


// board
export const aggregateBoards = (id = undefined) => ({
  id,
  type: actionTypes.AGGREGATE_BOARDS,
});


// display board
export const getInitialDisplayBoard = () => ({
  type: actionTypes.GET_INITIAL_DISPLAY_BOARD,
});

export const getNextDisplayBoard = () => ({
  type: actionTypes.GET_NEXT_DISPLAY_BOARD,
});

export const handleTuTick = () => (
  (dispatch) => {
    dispatch(incrementTu());
    dispatch(getNextDisplayBoard());
    p2pSendHeartbeatToPeers();
  }
);


// P2P
let peer;
const peerConnections = {};

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

export const addPeerToGame = id => (
  (dispatch) => {
    dispatch(p2pUpdatePeerList(id));
    dispatch(addNewSnake(id));
  }
);

export const p2pRemovePeerFromList = id => ({
  id,
  type: actionTypes.P2P_REMOVE_PEER_FROM_LIST,
});

export const p2pAddCloseListener = (connection, dispatch) => {
  connection.on('close', () => {
    console.log(`Removing peer: ${connection.peer}`);
    dispatch(p2pRemovePeerFromList(connection.peer));
    delete peerConnections[connection.peer];
  });
};

export const p2pSendGameStatus = status => (
  (dispatch) => {
    Object.values(peerConnections).forEach((connection) => {
      connection.send(status);
    });
    dispatch(updateGameStatus(status));
  }
);

export const p2pSendHeartbeatToPeers = () => {
  if (store.getState().info.tu % constants.HEARTBEAT_INTERVAL === 0) {
    Object.values(peerConnections).forEach((connection) => {
      console.log(`sending heartbeat to ${connection.peer}`);
      connection.send(`Heartbeat from ${peer.id}`);
    });
  }
};

export const p2pConnectToNewPeers = (list, dispatch) => {
  list.forEach((peerId) => {
    if (store.getState().p2p.peers[peerId] || peerId === peer.id) {
      return;
    }

    const dataConnection = peer.connect(peerId);
    dataConnection.on('open', () => {
      p2pSetDataListener(dataConnection, dispatch);
      dispatch(addPeerToGame(dataConnection.peer));
      peerConnections[peerId] = dataConnection;
    });
    p2pAddCloseListener(dataConnection, dispatch);
  });
};

export const p2pSetDataListener = (connection, dispatch) => {
  connection.on('data', (data) => {
    console.log(`received data from ${connection.peer}`);

    if (store.getState().info.gameStatus !== constants.GAME_STATUS_PLAYING) {
      if (typeof data === 'string') {
        dispatch(updateGameStatus(data));
      } else {
        p2pConnectToNewPeers(data, dispatch);
      }
    } else {
      // This is where we'll process peer snakes received
    }
  });
};

export const p2pConnectToKnownPeers = (dispatch) => {
  const peerIds = Object.keys(store.getState().p2p.peers);
  peerIds.forEach((peerId) => {
    if (peerId !== peer.id) {
      const dataConnection = peer.connect(peerId);
      dataConnection.on('open', () => {
        p2pSetDataListener(dataConnection, dispatch);
        dispatch(addPeerToGame(peerId));
        peerConnections[peerId] = dataConnection;
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
        dispatch(initializeOwnSnake(id));
        p2pConnectToKnownPeers(dispatch);
      })
      .on('connection', (dataConnection) => {
        dataConnection.on('open', () => {
          p2pSetDataListener(dataConnection, dispatch);
          dispatch(addPeerToGame(dataConnection.peer));
          peerConnections[dataConnection.peer] = dataConnection;
          dataConnection.send(Object.keys(store.getState().p2p.peers));
        });
        p2pAddCloseListener(dataConnection, dispatch);
      });
  }
);

export const receivePeerSnakeData = (id, data) => (
  (dispatch) => {
    dispatch(updatePeerSnakeData(id, data));
    dispatch(aggregateBoards(id));
  }
);
