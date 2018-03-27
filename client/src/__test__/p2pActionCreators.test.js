import * as actionTypes from '../redux/actionTypes';
import * as p2pActions from '../redux/p2p/p2pActionCreators';

describe('P2P action creators', () => {
  it('p2pConnectionReady returns expected object', () => {
    const id = 'dfihuv0923';

    const obj = p2pActions.p2pConnectionReady(id);
    expect(obj).toEqual({
      id,
      type: actionTypes.P2P_CONNECTION_READY,
    });
  });

  it('p2pGetPeerIdFromURL returns expected object', () => {
    const id = 'ekjrbf98475';

    const obj = p2pActions.p2pGetPeerIdFromURL(id);
    expect(obj).toEqual({
      id,
      type: actionTypes.P2P_GET_PEERID_FROM_URL,
    });
  });

  it('p2pAddPeerToList returns expected object', () => {
    const id = 'ekjrbf98475';

    const obj = p2pActions.p2pAddPeerToList(id);
    expect(obj).toEqual({
      id,
      type: actionTypes.P2P_ADD_PEER_TO_LIST,
    });
  });

  it('p2pRemovePeerFromList returns expected object', () => {
    const id = 'kljwbef089735';

    const obj = p2pActions.p2pRemovePeerFromList(id);
    expect(obj).toEqual({
      id,
      type: actionTypes.P2P_REMOVE_PEER_FROM_LIST,
    });
  });

  it('p2pUpdatePeerUsername returns expected object', () => {
    const id = 'gebfk1367854';
    const username = 'houvjkner';

    const obj = p2pActions.p2pUpdatePeerUsername(id, username);
    expect(obj).toEqual({
      id,
      username,
      type: actionTypes.P2P_UPDATE_PEER_USERNAME,
    });
  });
});
