import React from 'react';

const Troubleshooting = () => (
  <main className='container'>
    <h1>Troubleshooting</h1>
    <p>This game was created to experiment with fast-paced, real-time,
      peer-to-peer data exchange over the WebRTC data channel. By its nature,
      direct peer-to-peer communication is not as reliable as communication
      overseen by a central server, so inconsistencies are expected. Moreover,
      browser support for WebRTC is not yet universal, and WebRTC is rarely used
      for applications like ours. This game seeks to provide a coherent user
      experience by gracefully handling the volatility and unpredictability of
      real-time peer-to-peer data exchange, but as it is built on unstable
      technologies and is experimental in nature, users should expect eccentric
      behaviors on occasion.</p>
    <h2>General Suggestions to Minimize Problems</h2>
    <ul>
      <li><b>Use <a href='https://www.google.com/chrome/'>Chrome</a> or <a
        href='https://www.mozilla.org/firefox'>Firefox</a></b>.
        No other browsers are supported.
      </li>
      <li>All players should <b>use the same browser</b>. Peer-to-peer
        communication
        between Firefox and Chrome is supported, but is less reliable than
        Firefox-to-Firefox or Chrome-to-Chrome.
      </li>
    </ul>

    <h2>Specific Issues</h2>
    <ul>
      <li><b>Nobody can connect to me</b> - Refresh your page to get a new
        sharing
        link and try again. This will renew your connection to the signaling
        server that brokers connections between peers.
      </li>
      <li><b>My snake died for no reason</b> - You may have high latency.
        The effect of this is that your peers do not have current information
        about your snake and are automatically marking you as dead.
      </li>
      <li><b>A collision did not kill me</b> - When peer data is unavailable,
        the game will predict the positions of peer snakes based on their latest
        information. Collisions are not calculated against these predictions, so
        it will sometimes appear that you have hit another snake when you have
        only hit a prediction.  When peer data is unavailable for too long, the
        game will automatically mark that snake as dead.
      </li>
    </ul>
  </main>
);

export default Troubleshooting;
