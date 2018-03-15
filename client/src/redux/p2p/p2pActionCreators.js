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
    p2pConnectToNewPeers([id], dispatch);
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

    // these actions are shared with all players
    dispatch(infoActions.handleGameStatusChange(status));

    // these actions are only for the player that made the change
    if (status === constants.GAME_STATUS_PREGAME) {
      p2pBroadcastStartingRows();
      dispatch(snakeActions.initializeOwnSnake(peer.id));
      dispatch(metaActions.checkReadiness());
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

export const p2pSetCloseListener = (connection, dispatch) => {
  connection.on('close', () => {
    console.log(`Removing peer: ${connection.peer}`);
    dispatch(p2pRemovePeerFromList(connection.peer));
    dispatch(snakeActions.changeSnakeStatus(connection.peer, 'dead'));
    delete peerConnections[connection.peer];
  });
};

export const p2pSetDataListener = (connection, dispatch) => {
  connection.on('data', (data) => {
    const status = store.getState().info.gameStatus;

    switch (typeof data) {
      case 'string': {
        // game status change
        dispatch(infoActions.handleGameStatusChange(data));
        break;
      }
      case 'number': {
        // pregame: receive starting row and initialize own snake,
        // then send snake data to peers
        dispatch(snakeActions.initializeOwnSnake(peer.id, data));
        p2pBroadcastSnakeData();
        break;
      }
      case 'object': {
        if (Array.isArray(data)) {
          // lobby or postgame: connect to new peers
          p2pConnectToNewPeers(data, dispatch);
        } else {
          // pregame and playing: receive snake data from peers
          dispatch(metaActions.receiveSnakeData(connection.peer, data));

          if (status === constants.GAME_STATUS_PREGAME || status === constants.GAME_STATUS_READY_TO_PLAY) {
            // check readiness (do I have snake data for all peers?)
            dispatch(metaActions.checkReadiness());
          }
        }
        break;
      }
      default: {
        break;
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

