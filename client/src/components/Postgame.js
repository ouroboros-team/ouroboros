import React from 'react';
import propTypes from 'prop-types';

import * as constants from '../constants';

export default class Postgame extends React.Component {
  static propTypes = {
    changeGameStatus: propTypes.func,
    winner: propTypes.string,
    totalPlayers: propTypes.number,
  };

  static defaultProps = {
    changeGameStatus: () => {},
    winner: '',
    totalPlayers: 0,
  };

  getPostgameMessage = () => {
    const winner = this.props.winner;
    if (this.props.totalPlayers === 1) {
      return '';
    } else if (winner) {
      return `${winner} won the game!`;
    }

    return 'Tie game!';
  };

  handlePlayAgainClick = () => {
    this.props.changeGameStatus(constants.GAME_STATUS_LOBBY);
  };

  render() {
    const message = this.getPostgameMessage();

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
