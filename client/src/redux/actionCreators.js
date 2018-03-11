import store from './store';
import * as actionTypes from './actionTypes';
import * as p2pHelpers from './p2p/p2pHelpers';
import * as snakeHelpers from './snake/snakeHelpers';
import * as constants from '../constants';
/* eslint no-use-before-define: 0 */  // --> OFF

// info
export const incrementTu = () => ({
  type: actionTypes.INCREMENT_TU,
});

export const updateGameStatus = status => ({
  status,
  type: actionTypes.UPDATE_GAME_STATUS,
});

export const handleGameStatusChange = newStatus => (
  (dispatch) => {
    dispatch(updateGameStatus(newStatus));

    switch (newStatus) {
      case constants.GAME_STATUS_PREGAME: {
        p2pBroadcastSnakeData();
        break;
      }
      case constants.GAME_STATUS_PLAYING: {
        break;
      }
      case constants.GAME_STATUS_LOBBY:
      case constants.GAME_STATUS_POSTGAME:
      default: {
        break;
      }
    }
  }
);


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
    p2pBroadcastHeartbeatToPeers();
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

export const p2pBroadcast = (data) => {
  Object.values(peerConnections).forEach((connection) => {
    connection.send(data);
  });
};

export const p2pBroadcastGameStatus = status => (
  (dispatch) => {
    p2pBroadcast(status);
    dispatch(handleGameStatusChange(status));
  }
);

export const p2pBroadcastHeartbeatToPeers = () => {
  if (store.getState().info.tu % constants.HEARTBEAT_INTERVAL === 0) {
    p2pBroadcast(`Heartbeat from ${peer.id}`);
  }
};

export const p2pBroadcastSnakeData = () => {
  console.log('sending starting snake position to peers');
  p2pBroadcast(snakeHelpers.getOwnSnakeData());
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
  const id = connection.peer;

  connection.on('data', (data) => {
    if (typeof data === 'string') {
      dispatch(handleGameStatusChange(data));
    } else {
      const status = store.getState().info.gameStatus;

      switch (status) {
        case constants.GAME_STATUS_PREGAME: {
          // if pregame, receive starting positions
          receivePeerStartingPositions(id, data);
          break;
        }
        case constants.GAME_STATUS_PLAYING: {
          // if playing, receive snake data
          dispatch(receivePeerSnakeData(id, data));
          break;
        }
        case constants.GAME_STATUS_LOBBY:
        case constants.GAME_STATUS_POSTGAME:
        default: {
          // if lobby or postgame, connect to new peers
          p2pConnectToNewPeers(data, dispatch);
        }
      }
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

export const receivePeerStartingPositions = (id, data) => {
  console.log('not yet implemented: receivePeerStartingPositions');
  // receive position
  // check own position against peer positions
  // randomize new position for self if there is a collision
};
