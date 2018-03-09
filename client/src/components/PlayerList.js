import React from 'react';
import propTypes from 'prop-types';

const PlayerList = (props) => {
  const list = [];
  let localId = '';
  let playerName = '';
  let className = '';
  const peerIds = Object.keys(props.peers);

  peerIds.forEach((peerId) => {
    localId = props.peers[peerId].localId;
    playerName = `Player ${localId}`;
    className = `id-${localId}`;

    list.push(<li key={localId} className={className}>{playerName}</li>);
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
