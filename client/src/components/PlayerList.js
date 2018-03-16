import React from 'react';
import propTypes from 'prop-types';

const PlayerList = (props) => {
  const players = [];
  let className = '';
  let name = '';
  const peerIds = Object.keys(props.peers);

  peerIds.forEach((peerId) => {
    className = `id-${props.peers[peerId].styleId}`;
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
