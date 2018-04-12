import React from 'react';

import keyboard from '../assets/images/keyboard-arrows.png';

const HowToPlay = () => (
  <main className='container'>
    <h1>How To Play</h1>
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
  </main>
);

export default HowToPlay;
