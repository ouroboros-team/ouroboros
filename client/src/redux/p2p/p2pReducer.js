import * as actionTypes from '../actionTypes';

const defaultState = {
  id: '',
  ready: false,
  peers: [],
};

export default function p2pReducer(state = defaultState, action) {
  switch (action.type) {
    case actionTypes.P2P_CONNECTION_READY: {
      const newState = { ...state };
      newState.id = action.id;
      newState.ready = true;
      newState.peers = [ action.id ];
      return newState;
    }
    default: {
      return state;
    }
  }
}
