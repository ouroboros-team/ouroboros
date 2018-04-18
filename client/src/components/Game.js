import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';

import Loop from './Loop';
import GameBoard from './GameBoard';
import PlayerList from './PlayerList';
import Lobby from './Lobby';
import OutOfSync from './OutOfSync';
import Pregame from './Pregame';
import Postgame from './Postgame';

import * as constants from '../constants';
import * as p2pActions from '../redux/p2p/p2pActionCreators';

const Game = (props) => {
  let display;

  switch (props.status) {
    case constants.GAME_STATUS_PREGAME: {
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
    case constants.GAME_STATUS_OUT_OF_SYNC: {
      display = (
        <OutOfSync />
      );
      break;
    }
    case constants.GAME_STATUS_POSTGAME: {
      display = (
        <Postgame
          changeGameStatus={props.p2pBroadcastGameStatus}
          totalPlayers={Object.keys(props.snakes).length}
          winner={props.winner}
        />
      );
      break;
    }
    case constants.GAME_STATUS_LOBBY:
    default: {
      display = (
        <Lobby
          broadcastReady={props.p2pBroadcastReady}
          ownPeerId={props.ownPeerId}
          setOwnUsername={props.p2pSetOwnUsername}
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
  winner: propTypes.string,
  peers: propTypes.object, // eslint-disable-line react/forbid-prop-types
  snakes: propTypes.object, // eslint-disable-line react/forbid-prop-types
  p2pBroadcastGameStatus: propTypes.func,
  p2pBroadcastReady: propTypes.func,
  p2pSetOwnUsername: propTypes.func,
};

Game.defaultProps = {
  ownPeerId: '',
  status: constants.GAME_STATUS_PREGAME,
  winner: '',
  peers: {},
  snakes: {},
  p2pBroadcastGameStatus: () => {},
  p2pBroadcastReady: () => {},
  p2pSetOwnUsername: () => {},
};

const mapStateToProps = state => ({
  ownPeerId: state.p2p.id,
  status: state.info.gameStatus,
  winner: state.info.winner,
  peers: state.p2p.peers,
  snakes: state.snakes,
});

const mapDispatchToProps = dispatch => ({
  p2pBroadcastGameStatus: (status) => {
    dispatch(p2pActions.p2pBroadcastGameStatus(status));
  },
  p2pBroadcastReady: () => {
    dispatch(p2pActions.p2pBroadcastReady());
  },
  p2pSetOwnUsername: (username) => {
    dispatch(p2pActions.p2pSetOwnUsername(username));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
