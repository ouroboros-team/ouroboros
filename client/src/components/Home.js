import React from 'react';
import FilterLink from './FilterLink';

import gameBoard from '../assets/images/partial-game-board.png';

const HowToPlay = () => (
  <main className='container'>
    <div className='eight columns'>
      <h1>Welcome</h1>
      <p>Ouroboros is a peer-to-peer snake game built
        by <a href='http://siennamwood.com/'>Sienna M. Wood</a> and Grant
        Reed to explore peer-to-peer gaming architectures and their challenges.
      </p>
      <ul>
        <li><FilterLink filter='play'>Play the game</FilterLink></li>
        <li>More about this project (coming soon!)</li>
        <li><FilterLink filter='how-to-play'>How to play</FilterLink></li>
        <li>Problems? <FilterLink filter='troubleshooting'>Get help</FilterLink></li>
        <li><a href='https://github.com/ouroboros-team/ouroboros'>Check out our code on GitHub</a></li>
      </ul>
    </div>
    <div className='four columns'>
      <img alt='game board' src={gameBoard} />
    </div>
  </main>
);

export default HowToPlay;
