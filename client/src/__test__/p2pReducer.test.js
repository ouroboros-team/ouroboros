import p2pReducer from '../redux/p2p/p2pReducer';
import * as actionTypes from '../redux/actionTypes';

describe('P2P reducer', () => {
  let state = {};

  beforeEach(() => {
    state = {
      id: '',
      ready: false,
      peers: {
        hello: { styleId: 5, defaultUsername: 'Player 5', username: 'a username' },
      },
      nextStyleId: 7,
      sharedPeerId: '',
    };
  });

  it('P2P_GET_PEERID_FROM_URL populates sharedPeerId with id passed in', () => {
    const actionObj = {
      id: 'begrdhiuv3267',
      type: actionTypes.P2P_GET_PEERID_FROM_URL,
    };

    const newState = p2pReducer(state, actionObj);
    expect(newState.sharedPeerId).toBe(actionObj.id);
  });

  it('P2P_ADD_PEER_TO_LIST does nothing if the passed peer id is already present', () => {
    const actionObj = {
      id: 'hello',
      type: actionTypes.P2P_ADD_PEER_TO_LIST,
    };

    expect(state.peers[actionObj.id]).toBeDefined();
    const newState = p2pReducer(state, actionObj);
    expect(newState).toBe(state);
  });

  it('P2P_ADD_PEER_TO_LIST adds passed peer to list when not already present', () => {
    const actionObj = {
      id: 'dfhilu3478',
      type: actionTypes.P2P_ADD_PEER_TO_LIST,
    };

    expect(state.peers[actionObj.id]).not.toBeDefined();
    const newState = p2pReducer(state, actionObj);
    expect(newState.peers[actionObj.id]).toBeDefined();
  });

  it('P2P_ADD_PEER_TO_LIST adds styleId to new peer and increments nextStyleId', () => {
    const actionObj = {
      id: 'dfhilu3478',
      type: actionTypes.P2P_ADD_PEER_TO_LIST,
    };

    const newState = p2pReducer(state, actionObj);
    expect(newState.peers[actionObj.id].styleId).toBe(state.nextStyleId);
    expect(newState.nextStyleId).toBe(state.nextStyleId + 1);
  });

  it('P2P_ADD_PEER_TO_LIST adds defaultUsername to new peer based on nextStyleId', () => {
    const actionObj = {
      id: 'dfhilu3478',
      type: actionTypes.P2P_ADD_PEER_TO_LIST,
    };

    const newState = p2pReducer(state, actionObj);
    expect(newState.peers[actionObj.id].defaultUsername).toBe(`Player ${state.nextStyleId}`);
  });

  it('P2P_REMOVE_PEER_FROM_LIST removes peer from list when present', () => {
    const actionObj = {
      id: 'hello',
      type: actionTypes.P2P_REMOVE_PEER_FROM_LIST,
    };

    expect(state.peers[actionObj.id]).toBeDefined();
    const newState = p2pReducer(state, actionObj);
    expect(newState.peers[actionObj.id]).not.toBeDefined();
  });

  it('P2P_REMOVE_PEER_FROM_LIST does nothing when passed a nonexistent id', () => {
    const actionObj = {
      id: 'ijaefjkn2467',
      type: actionTypes.P2P_REMOVE_PEER_FROM_LIST,
    };

    expect(state.peers[actionObj.id]).not.toBeDefined();
    const newState = p2pReducer(state, actionObj);
    expect(newState).toBe(state);
  });

  it('P2P_UPDATE_PEER_USERNAME sets passed username for passed peer id', () => {
    const actionObj = {
      username: 'new username',
      id: 'hello',
      type: actionTypes.P2P_UPDATE_PEER_USERNAME,
    };

    expect(state.peers[actionObj.id].username).not.toBe(actionObj.username);
    const newState = p2pReducer(state, actionObj);
    expect(newState.peers[actionObj.id].username).toBe(actionObj.username);
  });

  it('P2P_UPDATE_PEER_USERNAME does not set a blank username', () => {
    const actionObj = {
      username: '    ',
      id: 'hello',
      type: actionTypes.P2P_UPDATE_PEER_USERNAME,
    };

    const newState = p2pReducer(state, actionObj);
    expect(newState.peers[actionObj.id].username).toBe(state.peers[actionObj.id].username);
  });

  it('P2P_UPDATE_PEER_USERNAME does nothing when passed a nonexistent id', () => {
    const actionObj = {
      username: 'new username',
      id: 'goodbye',
      type: actionTypes.P2P_UPDATE_PEER_USERNAME,
    };

    const newState = p2pReducer(state, actionObj);
    expect(newState).toBe(state);
  });

  it('P2P_CONNECTION_READY sets ready to true', () => {
    const actionObj = { type: actionTypes.P2P_CONNECTION_READY };

    const newState = p2pReducer(state, actionObj);
    expect(newState.ready).toBe(true);
  });

  it('P2P_CONNECTION_READY sets own peer id to passed id', () => {
    const actionObj = {
      id: 'kjberguix8723',
      type: actionTypes.P2P_CONNECTION_READY,
    };

    expect(state.id).not.toBe(actionObj.id);
    const newState = p2pReducer(state, actionObj);
    expect(newState.id).toBe(actionObj.id);
  });
});
