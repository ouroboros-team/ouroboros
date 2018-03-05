import React from 'react';

export default class PlayerList extends React.Component {
  render() {
    return (
      <div id='player-list' className='three columns'>
        <ul>
          <li className='id-0'>Player 0</li>
          <li className='id-1'>Player 1</li>
          <li className='id-2'>Player 2</li>
          <li className='id-3'>Player 3</li>
        </ul>
      </div>
    );
  }
}
