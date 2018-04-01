import React from 'react';
import propTypes from 'prop-types';

import * as constants from '../constants';

export default class Pregame extends React.Component {
  static propTypes = {
    changeGameStatus: propTypes.func,
    status: propTypes.string,
  };

  static defaultProps = {
    changeGameStatus: () => {
    },
    status: constants.GAME_STATUS_PREGAME,
  };

  handleStartClick = () => {
    this.props.changeGameStatus(constants.GAME_STATUS_PLAYING);
  };


  render() {
    return (
      <div>
        <h1>Preparing Game</h1>
        <div id='messages'>
          <p>Preparing a new game with you and the other connected players.</p>
        </div>
        <input
          disabled={this.props.status !== constants.GAME_STATUS_READY_TO_PLAY}
          type='button'
          value={
            this.props.status !== constants.GAME_STATUS_READY_TO_PLAY ?
              'Waiting for all players to be ready...' : 'Start Game'
          }
          onClick={this.handleStartClick}
          autoFocus
        />
      </div>
    );
  }
}
