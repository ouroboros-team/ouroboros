import * as actionTypes from '../actionTypes';
import * as metaHelpers from '../metaHelpers';

const defaultState = {
  id: '',
  ready: false,
  peers: [],
};

export default function p2pReducer(state = defaultState, action) {
  switch (action.type) {
    case actionTypes.P2P_GET_PEERID_FROM_URL: {
      const newState = metaHelpers.deepClone(state);
      newState.peers.push(action.id);
      return newState;
    }
    case actionTypes.P2P_UPDATE_PEER_LIST: {
      const newState = metaHelpers.deepClone(state);
      newState.peers.push(action.id);
      return newState;
    }
    case actionTypes.P2P_CONNECTION_READY: {
      const newState = metaHelpers.deepClone(state);
      newState.id = action.id;
      newState.ready = true;
      newState.peers.push(action.id);
      return newState;
    }
    default: {
      return state;
    }
  }
}
