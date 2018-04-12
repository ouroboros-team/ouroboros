import React from 'react';

import logo from '../assets/images/logo.svg';

const OutOfSync = () => (
  <main className='container'>
    <h1 className='align-center'>Out of Sync</h1>
    <p className='align-center'>You are out of sync with an ongoing game.  Please wait.</p>
    <div className='wait'>
      <img alt='O' className='logo' src={logo} />
    </div>
  </main>
);

export default OutOfSync;
