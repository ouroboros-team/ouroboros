import React from 'react';
import propTypes from 'prop-types';

import * as constants from '../constants';
import logo from '../assets/images/logo.svg';

export default class Pregame extends React.Component {
  state = {
    timer: null,
    countdown: 20,
  };

  static propTypes = {
    changeGameStatus: propTypes.func,
    status: propTypes.string,
  };

  static defaultProps = {
    changeGameStatus: () => {},
    status: constants.GAME_STATUS_PREGAME,
  };

  componentDidMount() {
    if (!this.state.timer) { // so multiple calls don't result in multiple timers
      const timer = setInterval(this.tick, 1000);
      this.setState({ timer });
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  tick = () => {
    if (this.state.countdown > 0) {
      this.setState({ countdown: this.state.countdown - 1 });
    } else {
      clearInterval(this.state.timer);
      this.props.changeGameStatus(constants.GAME_STATUS_PLAYING);
    }
  };

  render() {
    return (
      <div>
        <h1>Preparing Game</h1>
        <div id='messages'>
          <p>The game will start automatically in a few moments, or as soon as
            all connected players are ready. Please wait.</p>
          <div className='wait'>
            <img alt='O' className='logo' src={logo} />
          </div>
        </div>
      </div>
    );
  }
}
