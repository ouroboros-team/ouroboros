import * as actionTypes from '../actionTypes';
import * as constants from '../../constants';

const defaultState = {
  id: '',
  ready: false,
  peers: {},
  nextStyleId: 0,
  sharedPeerId: '',
};

export default function p2pReducer(state = defaultState, action) {
  switch (action.type) {
    case actionTypes.P2P_GET_PEERID_FROM_URL: {
      const newState = { ...state };
      newState.sharedPeerId = action.id;
      return newState;
    }
    case actionTypes.P2P_ADD_PEER_TO_LIST: {
      if (state.peers[action.id]) {
        return state;
      }

      const newState = { ...state };
      newState.peers = { ...newState.peers };

      newState.peers[action.id] = {
        styleId: newState.nextStyleId,
        defaultUsername: `Player ${newState.nextStyleId}`,
        status: constants.PEER_STATUS_CONNECTED,
      };
      newState.nextStyleId += 1;
      return newState;
    }
    case actionTypes.P2P_REMOVE_PEER_FROM_LIST: {
      if (!state.peers[action.id]) {
        return state;
      }
      const newState = { ...state };
      newState.peers = { ...newState.peers };
      delete newState.peers[action.id];
      return newState;
    }
    case actionTypes.P2P_UPDATE_PEER_USERNAME: {
      const username = action.username.trim();

      // ignore blank usernames and nonexistent peers
      if (username === '' || !state.peers[action.id]) {
        return state;
      }

      const newState = { ...state };
      newState.peers = { ...newState.peers };
      newState.peers[action.id] = { ...newState.peers[action.id] };
      newState.peers[action.id].username = username;
      return newState;
    }
    case actionTypes.P2P_CONNECTION_READY: {
      const newState = { ...state };
      newState.id = action.id;
      newState.ready = true;
      return newState;
    }
    case actionTypes.P2P_UPDATE_PEER_STATUS: {
      if (state.peers[action.id].status === action.status) {
        return state;
      }

      const newState = { ...state };
      newState.peers = { ...newState.peers };
      newState.peers[action.id] = { ...newState.peers[action.id] };
      newState.peers[action.id].status = action.status;
      return newState;
    }
    default: {
      return state;
    }
  }
}
