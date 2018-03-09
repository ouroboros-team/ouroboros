import React from 'react';

import Loop from './Loop';
import GameBoard from './GameBoard';
import PlayerList from './PlayerList';
import Lobby from './Lobby';
import * as constants from '../constants';

const Game = (props) => {
  // Check game status
  // render loop and gameboard if game underway
  // otherwise render lobby
  let display;
  if (props.status !== constants.GAME_STATUS_PLAYING) {
    display = <Lobby />;
  } else {
    display = (
      <Loop>
        <GameBoard />
      </Loop>
    );
  }

  return (
    <main id='game' className='container'>
      {display}
      <PlayerList />
    </main>
  );
};

export default Game;
