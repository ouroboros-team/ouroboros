import React from 'react';

import Loop from './Loop';
import GameGrid from './GameGrid';
import PlayerList from './PlayerList';

export default class Game extends React.Component {
  render() {
    const rows = 10;
    const columns = 10;

    return (
      <main id='game' className='container'>
        <Loop>
          <GameGrid
            columns={columns}
            rows={rows}
          />
          <PlayerList/>
        </Loop>
      </main>
    );
  }
}
