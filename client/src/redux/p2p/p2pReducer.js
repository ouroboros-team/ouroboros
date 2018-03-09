import * as actionTypes from '../actionTypes';
import * as metaHelpers from '../metaHelpers';

const defaultState = {
  id: '',
  ready: false,
  peers: {},
  nextLocalId: 0,
};

export default function p2pReducer(state = defaultState, action) {
  switch (action.type) {
    case actionTypes.P2P_GET_PEERID_FROM_URL:
    case actionTypes.P2P_UPDATE_PEER_LIST: {
      const newState = metaHelpers.deepClone(state);
      newState.peers[action.id] = {};
      newState.peers[action.id].localId = newState.nextLocalId;
      newState.nextLocalId += 1;
      return newState;
    }
    case actionTypes.P2P_REMOVE_PEER_FROM_LIST: {
      const newState = metaHelpers.deepClone(state);
      delete newState.peers[action.id];
      return newState;
    }
    case actionTypes.P2P_CONNECTION_READY: {
      const newState = metaHelpers.deepClone(state);
      newState.id = action.id;
      newState.ready = true;
      newState.peers[action.id] = {};
      newState.peers[action.id].localId = newState.nextLocalId;
      newState.nextLocalId += 1;
      return newState;
    }
    default: {
      return state;
    }
  }
}
