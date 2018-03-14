import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';

import Loop from './Loop';
import GameBoard from './GameBoard';
import PlayerList from './PlayerList';
import Lobby from './Lobby';
import Pregame from './Pregame';
import Postgame from './Postgame';

import * as constants from '../constants';
import * as p2pActions from '../redux/p2p/p2pActionCreators';

const Game = (props) => {
  let display;

  switch (props.status) {
    case constants.GAME_STATUS_PREGAME:
    case constants.GAME_STATUS_READY_TO_PLAY: {
      display = (
        <Pregame
          changeGameStatus={props.p2pBroadcastGameStatus}
          status={props.status}
        />
      );
      break;
    }
    case constants.GAME_STATUS_PLAYING: {
      display = (
        <Loop>
          <GameBoard />
        </Loop>
      );
      break;
    }
    case constants.GAME_STATUS_POSTGAME: {
      display = (
        <Postgame
          changeGameStatus={props.p2pBroadcastGameStatus}
        />
      );
      break;
    }
    case constants.GAME_STATUS_LOBBY:
    default: {
      display = (
        <Lobby
          ownPeerId={props.ownPeerId}
          changeGameStatus={props.p2pBroadcastGameStatus}
        />
      );
      break;
    }
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
  ownPeerId: propTypes.string,
  status: propTypes.string,
  peers: propTypes.object, // eslint-disable-line react/forbid-prop-types
};

Game.defaultProps = {
  ownPeerId: '',
  status: constants.GAME_STATUS_PREGAME,
  peers: {},
};

const mapStateToProps = state => ({
  ownPeerId: state.p2p.id,
  status: state.info.gameStatus,
  peers: state.p2p.peers,
});

const mapDispatchToProps = dispatch => ({
  p2pBroadcastGameStatus: (status) => {
    dispatch(p2pActions.p2pBroadcastGameStatus(status));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
