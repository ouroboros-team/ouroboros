import store from '../store';
import * as constants from '../../constants';
import * as actionTypes from '../actionTypes';

import * as metaActions from '../metaActionCreators';
import * as infoActions from '../info/infoActionCreators';
import * as snakeActions from '../snake/snakeActionCreators';

import * as helpers from '../metaHelpers';
import * as p2pHelpers from './p2pHelpers';
import * as snakeHelpers from '../snake/snakeHelpers';

/* eslint no-use-before-define: 0 */  // --> OFF

let peer;
const peerConnections = {};

export const p2pConnectionReady = id => ({
  id,
  type: actionTypes.P2P_CONNECTION_READY,
});

export const p2pGetPeerIdFromURL = id => ({
  id,
  type: actionTypes.P2P_GET_PEERID_FROM_URL,
});

export const p2pUpdatePeerList = id => ({
  id,
  type: actionTypes.P2P_UPDATE_PEER_LIST,
});

export const p2pRemovePeerFromList = id => ({
  id,
  type: actionTypes.P2P_REMOVE_PEER_FROM_LIST,
});

export const p2pConnectToNewPeers = (list, dispatch) => {
  list.forEach((peerId) => {
    if (store.getState().p2p.peers[peerId] || peerId === peer.id) {
      return;
    }

    const dataConnection = peer.connect(peerId);
    dataConnection.on('open', () => {
      p2pSetDataListener(dataConnection, dispatch);
      dispatch(p2pUpdatePeerList(dataConnection.peer));
      peerConnections[peerId] = dataConnection;
    });
    p2pSetCloseListener(dataConnection, dispatch);
  });
};

export const p2pConnectToURLPeer = (dispatch) => {
  const id = store.getState().p2p.sharedPeerId;

  if (id && id !== '') {
    p2pConnectToNewPeers([ id ], dispatch);
  }
};

export const p2pBroadcast = (data) => {
  Object.values(peerConnections).forEach((connection) => {
    connection.send(data);
  });
};

export const p2pBroadcastGameStatus = status => (
  (dispatch) => {
    p2pBroadcast(status);
    dispatch(infoActions.handleGameStatusChange(status));

    if (status === constants.GAME_STATUS_PREGAME) {
      // if new status is pregame, broadcast rows and initialize own snake
      p2pBroadcastStartingRows();
      dispatch(snakeActions.initializeOwnSnake(peer.id));
    }
  }
);

export const p2pBroadcastStartingRows = () => {
  // player who set new game status to pregame
  // chooses random starting row positions for all peers
  Object.values(peerConnections).forEach((connection) => {
    connection.send(helpers.randomUniqueRow());
  });
};

export const p2pBroadcastSnakeData = () => {
  p2pBroadcast(snakeHelpers.getOwnSnakeData());
};

export const broadcastResetGame = () => (
  (dispatch) => {
    dispatch(p2pBroadcastGameStatus(constants.GAME_STATUS_LOBBY));
    dispatch(metaActions.resetGameData());
  }
);

export const p2pSetCloseListener = (connection, dispatch) => {
  connection.on('close', () => {
    console.log(`Removing peer: ${connection.peer}`);
    dispatch(p2pRemovePeerFromList(connection.peer));
    dispatch(snakeActions.changeSnakeStatus(connection.peer, 'dead'));
    delete peerConnections[connection.peer];
  });
};

export const p2pSetDataListener = (connection, dispatch) => {
  const id = connection.peer;

  connection.on('data', (data) => {
    console.log(`received ${data} from ${id}`);

    if (typeof data === 'string') {
      dispatch(infoActions.handleGameStatusChange(data));
    } else {
      const status = store.getState().info.gameStatus;

      switch (status) {
        case constants.GAME_STATUS_PREGAME: {
          if (typeof data === 'number') {
            // receive starting row and initialize own snake
            // then send snake data to peers
            dispatch(snakeActions.initializeOwnSnake(peer.id, data));
            p2pBroadcastSnakeData();
          } else {
            // receive snake data from peers
            dispatch(metaActions.receiveSnakeData(connection.peer, data));
          }
          break;
        }
        case constants.GAME_STATUS_PLAYING: {
          // if playing, receive snake data
          dispatch(metaActions.receiveSnakeData(id, data));
          break;
        }
        case constants.GAME_STATUS_LOBBY:
        default: {
          // if lobby or postgame, connect to new peers
          p2pConnectToNewPeers(data, dispatch);
        }
      }
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
        dispatch(p2pUpdatePeerList(id));
        p2pConnectToURLPeer(dispatch);
      })
      .on('connection', (dataConnection) => {
        dataConnection.on('open', () => {
          p2pSetDataListener(dataConnection, dispatch);
          dispatch(p2pUpdatePeerList(dataConnection.peer));
          peerConnections[dataConnection.peer] = dataConnection;
          dataConnection.send(Object.keys(store.getState().p2p.peers));
        });
        p2pSetCloseListener(dataConnection, dispatch);
      });
  }
);

