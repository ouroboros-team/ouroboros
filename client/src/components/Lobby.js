import React from 'react';
import propTypes from 'prop-types';

import * as constants from '../constants';

export default class Lobby extends React.Component {
  static propTypes = {
    ownPeerId: propTypes.string,
    changeGameStatus: propTypes.func,
  };

  static defaultProps = {
    ownPeerId: '',
    changeGameStatus: () => {
    },
  };

  handlePlayClick = () => {
    this.props.changeGameStatus(constants.GAME_STATUS_PREGAME);
  };

  render() {
    return (
      <div>
        <h1>Welcome</h1>
        <div id='messages'>
          <p>Sharing link: <a
            href={`${window.location.origin}/${this.props.ownPeerId}`}>
            {`${window.location.origin}/${this.props.ownPeerId}`}
          </a>
          </p>
        </div>
        <input
          type='button'
          value='Play with Connected Players'
          onClick={this.handlePlayClick}
        />
      </div>
    );
  }
}
