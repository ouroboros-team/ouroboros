import React from 'react';
import propTypes from 'prop-types';

import * as constants from '../constants';

const PlayerList = (props) => {
  const players = [];
  let className = '';
  let name = '';
  const peerIds = Object.keys(props.peers);

  peerIds.forEach((peerId) => {
    className = `id-${props.peers[peerId].styleId}`;

    // show player status except while playing or postgame
    if (props.status !== constants.GAME_STATUS_PLAYING &&
      props.status !== constants.GAME_STATUS_POSTGAME) {
      className += ` ${props.peers[peerId].status}`;
    }

    if (props.peers[peerId].username) {
      name = props.peers[peerId].username;
    } else {
      name = props.peers[peerId].defaultUsername;
    }

    players.push(
      <li
        key={peerId}
        className={className}
      >
        {name}
      </li>,
    );
  });

  return (
    <div id='player-list' className='label'>
      <ul>
        <li className='label'>Connected Players</li>
        {players}
      </ul>
    </div>
  );
};

PlayerList.propTypes = {
  peers: propTypes.object, // eslint-disable-line react/forbid-prop-types
};

PlayerList.defaultProps = {
  peers: {},
};

export default PlayerList;
