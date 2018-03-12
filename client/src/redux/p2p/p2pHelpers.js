import Peer from 'peerjs';

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

