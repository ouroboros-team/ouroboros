import Peer from 'peerjs';
import store from '../store';

export const initializeOwnPeerObject = () => {
  const host = window.location.hostname;
  const port = window.location.port || (window.location.protocol === 'https:' ? 443 : 80);
  const path = '/peerjs';

  return new Peer({
    host,
    port,
    path,
    config: {
      iceServers: [
        { url: 'stun:stun1.l.google.com:19302' },
        { url: 'stun:stun2.l.google.com:19302' },
        { url: 'stun:stun3.l.google.com:19302' },
        { url: 'stun:stun4.l.google.com:19302' },
        {
          url: 'turn:numb.viagenie.ca',
          credential: 'Asp8&Viper',
          username: 'sienna.m.wood@gmail.com',
        },
      ],
    },
    debug: 3,
  });
};

export const getOwnId = () => (
  store.getState().p2p.id
);

export const ownUsernameIsSet = () => {
  const state = store.getState();
  const id = state.p2p.id;
  if (state.p2p.peers[id]){
    return state.p2p.peers[id].username;
  }

  return false;
};
