import React from 'react';
import propTypes from 'prop-types';
import store from '../redux/store';

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

  state = {
    totalPlayers: Object.keys(store.getState().snakes).length,
  }

  getPostgameMessage = () => {
    if (this.state.totalPlayers === 1) {
      return '';
    }

    switch (this.props.winner) {
      case '': {
        return 'Determining result...';
      }
      case constants.GAME_RESULT_TIE: {
        return 'Tie game!';
      }
      default: {
        return `${this.props.winner} won the game!`;
      }
    }
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
