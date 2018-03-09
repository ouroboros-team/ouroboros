import React from 'react';
import { connect } from 'react-redux';

import * as constants from '../constants';
import * as actionCreators from '../redux/actionCreators';

class Loop extends React.Component {
  state = {
    timer: null,
  };

  componentDidMount() {
    this.props.aggregateInitialBoard();
    this.props.getInitialDisplayBoard();
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

  pauseGame = () => {
    clearInterval(this.state.timer);
    this.setState({ timer: null });
  };

  simulateNewPeerData = () => {
    const data = {
      direction: 'down',
      status: 'alive',
      body: [ // queue
        { row: 1, column: 9, tu: 7 },
        { row: 0, column: 9, tu: 6 },
        { row: 0, column: 8, tu: 5 },
        { row: 0, column: 7, tu: 4 },
      ],
      history: [ // queue
        { row: 1, column: 7, tu: 3 },
        { row: 2, column: 7, tu: 2 },
        { row: 3, column: 7, tu: 1 },
        { row: 4, column: 7, tu: 0 },
      ],
    };
    this.props.updatePeerSnakeData(1, data);
  };

  startGame = () => {
    if (!this.state.timer) { // so multiple calls don't result in multiple timers
      const timer = setInterval(this.tick, constants.LOOP_INTERVAL);
      this.setState({ timer });
    }
  };

  tick = () => {
    this.props.getNextDisplayBoard();
    this.props.incrementTu();
  };

  render() {
    return (
      <div id='loop'>
        <div>
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
  incrementTu: () => {
    dispatch(actionCreators.incrementTu());
  },
  changeSnakeDirection: (id, direction) => {
    dispatch(actionCreators.changeSnakeDirection(id, direction));
  },
  aggregateInitialBoard: () => {
    dispatch(actionCreators.aggregateInitialBoard());
  },
  getInitialDisplayBoard: () => {
    dispatch(actionCreators.getInitialDisplayBoard());
  },
  getNextDisplayBoard: () => {
    dispatch(actionCreators.getNextDisplayBoard());
  },
  updatePeerSnakeData: (id, data) => {
    dispatch(actionCreators.updatePeerSnakeData(id, data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Loop);
