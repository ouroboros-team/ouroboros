import React from 'react';

import Loop from './Loop';
import GameBoard from './GameBoard';
import PlayerList from './PlayerList';

export default class Game extends React.Component {
  render() {
    const rows = 10;
    const columns = 10;

    return (
      <main id='game' className='container'>
        <Loop>
          <GameBoard
            columns={columns}
            rows={rows}
          />
          <PlayerList/>
        </Loop>
      </main>
    );
  }
}
