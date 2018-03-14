import React from 'react';
import { connect } from 'react-redux';
import * as p2pActions from '../redux/p2p/p2pActionCreators';

class Postgame extends React.Component {
  handleReturnToLobby = () => {
    this.props.resetGameData();
  };

  render() {
    return (
      <div>
        <h1>Game Over</h1>
        <p className='label-text alert-text'>(Username) is the winner!</p>
        <input
          type='button'
          value='Play Again'
          onClick={this.handleReturnToLobby}
        />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  resetGameData: () => {
    dispatch(p2pActions.broadcastResetGame());
  },
});

export default connect(null, mapDispatchToProps)(Postgame);
