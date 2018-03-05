import React from 'react';

import '../assets/styles/index.scss';

import Header from './Header';
import Game from './Game';
// TODO: routes for informational screens

const App = () => {
  return (
    <div>
      <Header />
      <Game />
    </div>
  );
};

export default App;
