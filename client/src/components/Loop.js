import React from 'react';
import { connect } from 'react-redux';
import * as constants from '../constants';
import * as actionCreators from '../redux/actionCreators';

class Loop extends React.Component {
  state = {
    timer: null,
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeypress);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeypress);
    clearInterval(this.state.timer);
  }

  tick = () => {
    this.props.incrementTu();
  };

  startGame = () => {
    if (!this.state.timer) { // so multiple calls don't result in multiple timers
      const timer = setInterval(this.tick, constants.LOOP_INTERVAL);
      this.setState({ timer });
    }
  };

  pauseGame = () => {
    clearInterval(this.state.timer);
    this.setState({ timer: null });
  };

  handleKeypress = (e) => {
    const code = String(e.keyCode);

    // left: 37, up: 38, right: 39, down: 40
    const arrowKeyCodes = { 37: 'left', 38: 'up', 39: 'right', 40: 'down' };

    if (!Object.keys(arrowKeyCodes).includes(code)) {
      return;
    }

    console.log(arrowKeyCodes[code]);
    // this.props.changeSnakeDirection(0, arrowKeyCodes[code]);
  };

  handleRandomDirection = () => {
    if (this.state.tu % 3 === 0) {
      // this.props.changeSnakeDirection(1, this.getRandomDir());
    }
    if (this.state.tu % 3 === 1) {
      // this.props.changeSnakeDirection(2, this.getRandomDir());
    }
    if (this.state.tu % 3 === 2) {
      // this.props.changeSnakeDirection(3, this.getRandomDir());
    }
  };

  getRandomDir = () => {
    const options = ['up', 'down', 'left', 'right'];
    return options[Math.floor(Math.random() * options.length)];
  };

  handleKill = () => {
    // this.props.changeStatusCheckGameOver(0, 'dead');
  };

  handleRevive = () => {
    // this.props.changeStatusCheckGameOver(0, 'alive');
  };

  render() {
    return (
      <div id='loop'>
        <input
          type='button'
          value='Start'
          onClick={this.startGame}
        />
        <input
          type='button'
          value='Pause'
          onClick={this.pauseGame}
        />
        <input
          type='button'
          value='Kill Snake 0'
          onClick={this.handleKill}
        />
        <input
          type='button'
          value='Revive Snake 0'
          onClick={this.handleRevive}
        />
        {this.props.children}
      </div>
    );
  }
}

const mapStoreToProps = store => ({
  tu: store.info.tu,
});

const mapDispatchToProps = dispatch => ({
  incrementTu: () => {
    dispatch(actionCreators.incrementTu());
  },
});

export default connect(mapStoreToProps, mapDispatchToProps)(Loop);
