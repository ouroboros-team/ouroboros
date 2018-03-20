import React from 'react';
import propTypes from 'prop-types';

import * as constants from '../constants';

export default class Postgame extends React.Component {
  static propTypes = {
    changeGameStatus: propTypes.func,
    winner: propTypes.string,
  };

  static defaultProps = {
    changeGameStatus: () => {
    },
    winner: '',
  };

  handlePlayAgainClick = () => {
    this.props.changeGameStatus(constants.GAME_STATUS_LOBBY);
  };

  render() {
    let message;
    let winner = this.props.winner;

    if (winner === '') {
      message = 'Determining result...';
    } else if (winner === constants.GAME_RESULT_TIE) {
      message = 'Tie game!';
    } else {
      message = `${winner} won the game!`;
    }

    return (
      <div>
        <h1>Game Over</h1>
        <div id='messages'>
          <p className='label alert-text'>{message}</p>
        </div>
        <input
          type='button'
          value='Play Again'
          onClick={this.handlePlayAgainClick}
        />
      </div>
    );
  }
}
