import * as actionTypes from '../actionTypes';
import * as helpers from '../metaHelpers';
import { deepClone } from '../metaHelpers';

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
    case actionTypes.P2P_UPDATE_PEER_LIST: {
      const newState = { ...state };
      newState.peers = deepClone(newState.peers);
      newState.peers[action.id] = {
        styleId: newState.nextStyleId,
        username: `Player ${newState.nextStyleId}`,
      };
      newState.nextStyleId += 1;
      return newState;
    }
    case actionTypes.P2P_REMOVE_PEER_FROM_LIST: {
      const newState = helpers.deepClone(state);
      delete newState.peers[action.id];
      return newState;
    }
    case actionTypes.P2P_CONNECTION_READY: {
      const newState = helpers.deepClone(state);
      newState.id = action.id;
      newState.ready = true;
      return newState;
    }
    default: {
      return state;
    }
  }
}
