import React from 'react';
import { connect } from 'react-redux';

import * as constants from '../constants';
import * as actionCreators from '../redux/actionCreators';

class Loop extends React.Component {
  state = {
    timer: null,
    initialized: false,
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeypress);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeypress);
    clearInterval(this.state.timer);
  }

  handleKeypress = (e) => {
    const code = String(e.keyCode);

    // left: 37, up: 38, right: 39, down: 40
    const arrowKeyCodes = { 37: 'left', 38: 'up', 39: 'right', 40: 'down' };

    if (!Object.keys(arrowKeyCodes).includes(code)) {
      return;
    }

    this.props.changeSnakeDirection(0, arrowKeyCodes[code]);
  };

  initializeGame = () => {
    this.props.aggregateBoards();
    this.props.getInitialDisplayBoard();
  };

  pauseGame = () => {
    clearInterval(this.state.timer);
    this.setState({ timer: null });
  };

  simulateNewPeerData = () => {
    const data = {
      direction: 'down',
      status: 'alive',
      positions: [ // queue
        { row: 1, column: 9, tu: 4 },
        { row: 0, column: 9, tu: 3 },
        { row: 0, column: 8, tu: 2 },
        { row: 0, column: 7, tu: 1 },
        { row: 1, column: 7, tu: 0 },
        { row: 2, column: 7, tu: -1 },
        { row: 3, column: 7, tu: -2 },
        { row: 4, column: 7, tu: -3 },
      ],
    };
    this.props.receivePeerSnakeData(1, data);
  };

  startGame = () => {
    if (!this.state.initialized) {
      this.props.aggregateBoards();
      this.props.getInitialDisplayBoard();
      this.setState({ initialized: true });
    }

    if (!this.state.timer) { // so multiple calls don't result in multiple timers
      const timer = setInterval(this.tick, constants.LOOP_INTERVAL);
      this.setState({ timer });
    }
  };

  tick = () => {
    this.props.handleTuTick();
  };

  render() {
    return (
      <div id='loop'>
        <div>
          <input
            type='button'
            value='Initialize'
            onClick={this.initializeGame}
          />
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
            value='Next TU'
            onClick={this.tick}
          />
          <input
            type='button'
            value='Simulate New Peer Data'
            onClick={this.simulateNewPeerData}
          />
        </div>
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = store => ({
  peerId: store.p2p.id,
});

const mapDispatchToProps = dispatch => ({
  handleTuTick: () => {
    dispatch(actionCreators.handleTuTick());
  },
  changeSnakeDirection: (id, direction) => {
    dispatch(actionCreators.changeSnakeDirection(id, direction));
  },
  aggregateBoards: () => {
    dispatch(actionCreators.aggregateBoards());
  },
  getInitialDisplayBoard: () => {
    dispatch(actionCreators.getInitialDisplayBoard());
  },
  receivePeerSnakeData: (id, data) => {
    dispatch(actionCreators.receivePeerSnakeData(id, data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Loop);
