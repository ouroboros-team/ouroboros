import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';

import Loop from './Loop';
import GameBoard from './GameBoard';
import PlayerList from './PlayerList';
import Lobby from './Lobby';
import Postgame from './Postgame';

import * as constants from '../constants';

const Game = (props) => {
  let display;

  if (props.status === constants.GAME_STATUS_LOBBY || props.status === constants.GAME_STATUS_PREGAME) {
    display = <Lobby />;
  } else if (props.status === constants.GAME_STATUS_POSTGAME) {
    display = <Postgame />;
  } else {
    display = (
      <Loop>
        <GameBoard />
      </Loop>
    );
  }

  return (
    <main id='game' className='container'>
      <div className='nine columns'>
        {display}
      </div>
      <div className='three columns'>
        <PlayerList peers={props.peers} />
      </div>
    </main>
  );
};

Game.propTypes = {
  status: propTypes.string,
  peers: propTypes.object, // eslint-disable-line react/forbid-prop-types
};

Game.defaultProps = {
  status: constants.GAME_STATUS_PREGAME,
  peers: {},
};

const mapStateToProps = state => ({
  status: state.info.gameStatus,
  peers: state.p2p.peers,
});

export default connect(mapStateToProps)(Game);
