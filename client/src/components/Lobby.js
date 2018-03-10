import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../redux/actionCreators';
import * as constants from '../constants';

class Lobby extends React.Component {
  handleStartClick = () => {
    this.props.p2pSendGameStatus(constants.GAME_STATUS_PREGAME);
  };

  render() {
    return (
      <div>
        <h1>{this.props.status === constants.GAME_STATUS_LOBBY ? 'Welcome' : 'Preparing Game'}</h1>
        <a href={`${window.location.origin}/${this.props.ownPeerId}`}>
          {`${window.location.origin}/${this.props.ownPeerId}`}
        </a>
        <br />
        <input
          type='button'
          value='Start Game'
          onClick={this.handleStartClick}
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
  p2pSendGameStatus: (status) => {
    dispatch(actionCreators.p2pSendGameStatus(status));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);
