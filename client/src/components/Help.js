import React from 'react';

import keyboard from '../assets/images/keyboard-arrows.png';

const Help = () => (
  <main className='container'>
    <h1>Help</h1>
    <h2>How To Play</h2>
    <div className='row'>
      <div className='eight columns'>
        <ul>
          <li><b>Control Your Snake</b> - Your snake will move forward until you
            change its direction using the arrow keys on your keyboard.
          </li>
          <li><b>Avoid Collisions</b> - Your snake will die instantly if your
            head collides with another snake or part of your own body. There are
            no walls in Ouroboros - the game board wraps from top to bottom and
            left to right.
          </li>
          <li><b>Play With Others</b> - Send your sharing link to friends (via
            email, text chat, social media, etc.) so they can join your game. A
            new sharing link will be generated each time you visit the site, so
            be sure to send them your new link next time.
          </li>
        </ul>
      </div>
      <div className='four columns align-center'>
        <img alt='keyboard arrow keys' className='keyboard' src={keyboard} />
      </div>
    </div>
    <h2>Technical Problems</h2>
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
    <h3>General Recommendations</h3>
    <ul>
      <li><b>Use <a href='https://www.mozilla.org/firefox'>Firefox</a></b>.
        No other browsers are currently supported.
      </li>
    </ul>

    <h3>Specific Issues</h3>
    <ul>
      <li><b>Nobody can connect to me</b> - Refresh your page to get a new
        sharing
        link and try again. This will renew your connection to the signaling
        server that brokers connections between peers.
      </li>
      <li><b>My game is interrupted with the 'Out of Sync' page</b> - You may
        have high latency with the other players, which means that your peers are
        not getting timely updates about your snake's position. When this is the
        case you are automatically removed from the game and sent to the 'Out of
        Sync' page.
      </li>
      <li><b>A collision did not kill me</b> - When peer data is unavailable,
        the game will predict the positions of peer snakes based on their latest
        information. Collisions are not calculated against these predictions, so
        it will sometimes appear that you have hit another snake when you have
        only hit a prediction.  When peer data is unavailable for too long, the
        game will automatically remove that snake from the game.
      </li>
    </ul>
  </main>
);

export default Help;
