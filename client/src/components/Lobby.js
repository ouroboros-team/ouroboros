import React from 'react';
import propTypes from 'prop-types';

import * as constants from '../constants';
import { ownUsernameIsSet } from '../redux/p2p/p2pHelpers';

export default class Lobby extends React.Component {
  state = {
    value: '',
    showForm: !ownUsernameIsSet(),
  };

  static propTypes = {
    changeGameStatus: propTypes.func,
    ownPeerId: propTypes.string,
    setOwnUsername: propTypes.func,
  };

  static defaultProps = {
    changeGameStatus: () => {},
    ownPeerId: '',
    setOwnUsername: () => {},
  };

  handleChange = (e) => {
    this.setState({ value: e.target.value });
  };

  handlePlayClick = () => {
    this.props.changeGameStatus(constants.GAME_STATUS_PREGAME);
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ showForm: false });
    this.props.setOwnUsername(this.state.value);
  };

  render() {
    let content = '';
    if (this.state.showForm) {
      content = (
        <form onSubmit={this.handleSubmit}>
          <label className='label' htmlFor='username'>
            Your name: <input type='text' name='username'
                              onChange={this.handleChange}
                              autoFocus />
          </label>
          <input type='submit' value='Submit' />
        </form>
      );
    } else {
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
            autoFocus
          />
        </div>
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
