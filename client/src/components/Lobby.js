import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../redux/actionCreators';
import * as constants from '../constants';

class Lobby extends React.Component {
  handlePregameClick = () => {
    this.props.p2pBroadcastGameStatus(constants.GAME_STATUS_PREGAME);
  };

  handlePlayingClick = () => {
    this.props.p2pBroadcastGameStatus(constants.GAME_STATUS_PLAYING);
  };

  render() {
    return (
      <div>
        <h1>{this.props.status === constants.GAME_STATUS_LOBBY ? 'Welcome' : 'Preparing Game'}</h1>
        <a href={`${window.location.origin}/#/${this.props.ownPeerId}`}>
          {`${window.location.origin}/#/${this.props.ownPeerId}`}
        </a>
        <br />
        <input
          type='button'
          value='Pregame'
          onClick={this.handlePregameClick}
        />
        <input
          type='button'
          value='Play'
          onClick={this.handlePlayingClick}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ownPeerId: state.p2p.id,
  status: state.info.gameStatus,
});

const mapDispatchToProps = dispatch => ({
  p2pBroadcastGameStatus: (status) => {
    dispatch(actionCreators.p2pBroadcastGameStatus(status));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);
