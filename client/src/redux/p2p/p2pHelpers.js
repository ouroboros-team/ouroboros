import Peer from 'peerjs';

export const initializeOwnPeerObject = () => {
  const host = window.location.hostname;
  const port = 3001;
  // const port = window.location.port || (window.location.protocol === 'https:' ? 443 : 80);

  return new Peer({
    host,
    port,
    path: '/peerjs',
    config: {
      iceServers: [
        { url: 'stun:stun1.l.google.com:19302' },
        {
          url: 'turn:numb.viagenie.ca',
          credential: 'conclave-rulez',
          username: 'sunnysurvies@gmail.com',
        },
      ],
    },
    debug: 3,
  });
};
