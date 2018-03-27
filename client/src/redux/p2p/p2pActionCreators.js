import store from '../store';
import * as constants from '../../constants';
import * as actionTypes from '../actionTypes';

import * as metaActions from '../metaActionCreators';
import * as headSetActions from '../headSet/headSetActionCreators';
import * as infoActions from '../info/infoActionCreators';
import * as snakeActions from '../snake/snakeActionCreators';

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

export const p2pAddPeerToList = id => ({
  id,
  type: actionTypes.P2P_ADD_PEER_TO_LIST,
});

export const p2pRemovePeerFromList = id => ({
  id,
  type: actionTypes.P2P_REMOVE_PEER_FROM_LIST,
});

export const p2pUpdatePeerUsername = (id, username) => ({
  id,
  username,
  type: actionTypes.P2P_UPDATE_PEER_USERNAME,
});

export const p2pConnectToNewPeers = (list, dispatch) => {
  const peers = store.getState().p2p.peers;

  list.forEach((peerId) => {
    if (peers[peerId] || peerId === p2pHelpers.getOwnId()) {
      return;
    }

    const dataConnection = peer.connect(peerId);
    dataConnection.on('open', () => {
      p2pSetDataListener(dataConnection, dispatch);
      dispatch(p2pAddPeerToList(dataConnection.peer));
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

export const p2pBroadcastWinnerId = (peerId) => {
  p2pBroadcast({ winnerId: peerId });
};

export const p2pBroadcastGameStatus = status => (
  (dispatch) => {
    p2pBroadcast(status);

    // these actions are shared with all players
    dispatch(infoActions.handleGameStatusChange(status));

    // these actions are only for the player that made the change
    if (status === constants.GAME_STATUS_PREGAME) {
      dispatch(p2pBroadcastStartingRows());
      dispatch(snakeActions.initializeOwnSnake(p2pHelpers.getOwnId()));
      dispatch(metaActions.checkReadiness());
    }
  }
);

export const p2pBroadcastStartingRows = () => (
  (dispatch) => {
    // player who set new game status to pregame
    // chooses random starting row positions for all peers
    let row;
    Object.values(peerConnections).forEach((connection) => {
      row = dispatch(infoActions.randomUniqueRow());
      connection.send(row);
    });
  }
);

export const p2pBroadcastSnakeData = () => {
  const ownSnake = snakeHelpers.getOwnSnakeData();
  if (ownSnake) {
    p2pBroadcast(ownSnake);
  }
};

export const p2pBroadcastPatch = (tu, sqNum, id) => {
  p2pBroadcast({
    patch: {
      tu,
      sqNum,
      id,
    },
  });
};

export const p2pKillPeerSnake = id => (
  (dispatch) => {
    p2pBroadcast({ dead: id });
    dispatch(snakeActions.handleChangeSnakeStatus(id, constants.SNAKE_STATUS_DEAD));
  }
);

export const p2pSetOwnUsername = username => (
  (dispatch) => {
    dispatch(p2pUpdatePeerUsername(p2pHelpers.getOwnId(), username));
    p2pBroadcast({ username });
  }
);

export const p2pSetCloseListener = (connection, dispatch) => {
  connection.on('close', () => {
    console.log(`Removing peer: ${connection.peer}`);
    dispatch(p2pRemovePeerFromList(connection.peer));
    dispatch(metaActions.checkReadiness());
    dispatch(snakeActions.handleChangeSnakeStatus(connection.peer, constants.SNAKE_STATUS_DEAD));
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
        dispatch(snakeActions.initializeOwnSnake(p2pHelpers.getOwnId(), data));
        p2pBroadcastSnakeData();
        break;
      }
      case 'object': {
        if (Array.isArray(data)) {
          // lobby or postgame: connect to new peers
          p2pConnectToNewPeers(data, dispatch);
        } else if (data.username || data.username === '') {
          // peer username
          dispatch(p2pUpdatePeerUsername(connection.peer, data.username));
        } else if (data.dead || data.dead === '') {
          // snake killed by head-on-collision or for too much latency
          dispatch(snakeActions.handleChangeSnakeStatus(data.dead, constants.SNAKE_STATUS_DEAD));
        } else if (Object.keys(data)[0] === 'winnerId') {
          // if peerId received, resolve to username
          const username = p2pHelpers.getUsername(data.winnerId);
          const result = username || constants.GAME_RESULT_TIE;
          dispatch(infoActions.updateWinner(result));
        } else if (data.patch || data.patch === '') {
          const info = data.patch;
          dispatch(headSetActions.patchHeadSet(info.tu, info.sqNum, info.id));
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
        console.log(`P2P error: ${error}`);
      })
      .on('open', (id) => {
        // id not passed successfully from peer.reconnect(),
        // so stored id is used if id is null
        let myId;

        if (id) {
          myId = id;
        } else {
          myId = p2pHelpers.getOwnId();
        }
        console.log(`My peer ID is: ${myId}`);
        dispatch(p2pConnectionReady(myId));
        dispatch(p2pAddPeerToList(myId));
        p2pConnectToURLPeer(dispatch);
      })
      .on('connection', (dataConnection) => {
        dataConnection.on('open', () => {
          p2pSetDataListener(dataConnection, dispatch);
          dispatch(p2pAddPeerToList(dataConnection.peer));
          peerConnections[dataConnection.peer] = dataConnection;

          // send list of peer ids, own username, game status to new peer
          const state = store.getState();
          const peers = state.p2p.peers;
          dataConnection.send(Object.keys(peers));
          dataConnection.send(state.info.gameStatus);
          if (peers[p2pHelpers.getOwnId()].username) {
            dataConnection.send({ username: peers[p2pHelpers.getOwnId()].username });
          }
        });
        p2pSetCloseListener(dataConnection, dispatch);
      })
      .on('disconnected', () => {
        const id = p2pHelpers.getOwnId();
        // peer.id and peer._lastServerId are sometimes cleared on disconnection
        // and must be repopulated for peer.reconnect() to attempt to reconnect
        // with the same id
        peer.id = id;
        peer._lastServerId = id;
        peer.reconnect();
      });
  }
);
