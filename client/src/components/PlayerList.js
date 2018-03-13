import React from 'react';
import propTypes from 'prop-types';

const PlayerList = (props) => {
  const list = [];
  let username = '';
  let playerName = '';
  let className = '';
  const peerIds = Object.keys(props.peers);

  peerIds.forEach((peerId) => {
    username = props.peers[peerId].username;
    playerName = `Player ${username}`;
    className = `id-${username}`;

    list.push(<li key={username} className={className}>{playerName}</li>);
  });

  return (
    <div id='player-list'>
      <ul>
        <li className='label'>Connected Players</li>
        {list}
      </ul>
    </div>
  );
};

PlayerList.propTypes = {
  peers: propTypes.object,
};

PlayerList.defaultProps = {
  peers: {},
};

export default PlayerList;
