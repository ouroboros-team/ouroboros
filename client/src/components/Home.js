import React from 'react';
import FilterLink from './FilterLink';

import gameBoard from '../assets/images/partial-game-board.png';

const Home = () => (
  <main className='container'>
    <h1>Welcome</h1>
    <div className='row'>
      <div className='seven columns'>
        <p>Ouroboros is a peer-to-peer snake game built by <a
            href='http://siennamwood.com/'
            rel='noopener noreferrer' target='_blank'
          >Sienna M. Wood</a> and <a
            href='https://grantdreed.github.io/'
            rel='noopener noreferrer' target='_blank'
          >Grant Reed</a> to explore peer-to-peer gaming architectures and their
          challenges.
        </p>
        <ul>
          <li><FilterLink filter='play'>Play the game</FilterLink></li>
          <li><FilterLink filter='about'>About this project</FilterLink></li>
          <li><FilterLink filter='help'>Having trouble? Get help</FilterLink></li>
          <li><a href='https://github.com/ouroboros-team/ouroboros' rel='noopener noreferrer' target='_blank'>Check out our code on GitHub</a></li>
        </ul>
      </div>
      <div className='five columns align-center'>
        <img alt='game board' src={gameBoard} />
      </div>
    </div>
  </main>
);

export default Home;
