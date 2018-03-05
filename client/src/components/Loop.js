import React from 'react';
import { connect } from "react-redux";
import * as actionCreators from '../redux/actionCreators';

class Loop extends React.Component {
  state = {
    timer: null,
    tu: 0
  };

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeypress);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeypress);
    clearInterval(this.state.timer);
  }

  tick = () => {
    this.setState({
      tu: this.state.tu + 1
    });
    this.handleRandomDirection();
    this.props.reckonAndUpdate();
  };

  startGame = () => {
    if (!this.state.timer) { // so multiple calls don't result in multiple timers
      let timer = setInterval(this.tick, 250);
      this.setState({timer});
    }
  };

  pauseGame = () => {
    clearInterval(this.state.timer);
    this.setState({timer: null});
  };

  handleKeypress = (e) => {
    const code = String(e.keyCode);

    // left: 37, up: 38, right: 39, down: 40
    const arrowKeyCodes = {37: 'left', 38: 'up', 39: 'right', 40: 'down'};

    if (!Object.keys(arrowKeyCodes).includes(code)) {
      return;
    }

    this.props.changeSnakeDirection(0, arrowKeyCodes[code]);
  };

  handleRandomDirection = () => {
    if (this.state.tu % 3 === 0) {
      this.props.changeSnakeDirection(1, this.getRandomDir());
    }
    if (this.state.tu % 3 === 1) {
      this.props.changeSnakeDirection(2, this.getRandomDir());
    }
    if (this.state.tu % 3 === 2) {
      this.props.changeSnakeDirection(3, this.getRandomDir());
    }
  };

  getRandomDir = () => {
    const options = ['up', 'down', 'left', 'right'];
    return options[Math.floor(Math.random() * options.length)];
  };

  handleKill = () => {
    this.props.changeStatusCheckGameOver(0, 'dead');
  };

  handleRevive = () => {
    this.props.changeStatusCheckGameOver(0, 'alive');
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
    )
  }
}

// todo:
// map game state ('pregame', 'playing', 'gameover') to props for timer
// start/stop const mapStateToProps = state => { };

const mapDispatchToProps = dispatch => ({
  reckonAndUpdate: () => {
    dispatch(actionCreators.reckonAndUpdate());
  },
  changeSnakeDirection: (id, direction) => {
    dispatch(actionCreators.changeSnakeDirection(id, direction))
  },
  changeStatusCheckGameOver: (id, status) => {
    dispatch(actionCreators.changeStatusCheckGameOver(id, status))
  },
});

export default connect(null, mapDispatchToProps)(Loop);
