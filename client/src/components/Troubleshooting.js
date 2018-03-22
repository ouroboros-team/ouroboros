import React from 'react';

const Troubleshooting = () => (
  <main className='container'>
    <h1>Troubleshooting</h1>
    <p>By nature, direct peer-to-peer communication (via WebRTC) is not as
      reliable as communication overseen by a central server, so inconsistencies
      are expected.  However, there are certain things that users can do to
      minimize problems:</p>
    <ul>
      <li>Use <a href='https://www.google.com/chrome/'>Chrome</a> or <a href='https://www.mozilla.org/firefox'>Firefox</a>.
        Safari, Internet Explorer, Edge, and Opera are not supported.</li>
      <li>All players should use the same browser. Peer-to-peer communication
        between Firefox and Chrome is supported, but is less reliable than
        Firefox-to-Firefox or Chrome-to-Chrome.</li>
      <li>If nobody can connect to you, refresh your page to get a new sharing
        link and try again. This will renew your connection to the signaling
        server that brokers connections between peers.</li>
    </ul>
  </main>
);

export default Troubleshooting;
