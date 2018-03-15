import React from 'react';
import propTypes from 'prop-types';

import * as constants from '../constants';

export default class Lobby extends React.Component {
  state = {
    value: '',
  };

  static propTypes = {
    changeGameStatus: propTypes.func,
    ownPeerId: propTypes.string,
    username: propTypes.string,
  };

  static defaultProps = {
    changeGameStatus: () => {
    },
    ownPeerId: '',
    username: '',
  };

  handleChange = (e) => {
    this.setState({ value: e.target.value });
  };

  handlePlayClick = () => {
    this.props.changeGameStatus(constants.GAME_STATUS_PREGAME);
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log('username', this.state.value);
  };

  render() {
    let content = '';
    if (this.props.username !== '') {
      content = (
        <div>
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
    } else {
      content = (
        <form onSubmit={this.handleSubmit}>
          <label className='label' htmlFor='username'>
            Your name: <input type='text' name='username'
                              onChange={this.handleChange} />
          </label>
          <input type='submit' value='Submit' />
        </form>
      );
    }

    return (
      <div>
        <h1>Welcome</h1>
        {content}
      </div>
    );
  }
}
