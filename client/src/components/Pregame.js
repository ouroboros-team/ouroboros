import React from 'react';
import propTypes from 'prop-types';

import * as constants from '../constants';

export default class Pregame extends React.Component {
  static propTypes = {
    changeGameStatus: propTypes.func,
  };

  static defaultProps = {
    changeGameStatus: () => {
    },
  };

  handleStartClick = () => {
    this.props.changeGameStatus(constants.GAME_STATUS_PLAYING);
  };


  render() {
    return (
      <div>
        <h1>Preparing Game</h1>
        <div id='messages'>
          <p>Waiting for other players</p>
        </div>
        <input
          type='button'
          value='Start Game'
          onClick={this.handleStartClick}
        />
      </div>
    );
  }
}
