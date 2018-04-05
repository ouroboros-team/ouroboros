import React from 'react';
import { connect } from 'react-redux';

import * as constants from '../constants';
import * as snakeActions from '../redux/snake/snakeActionCreators';
import * as boardActions from '../redux/board/boardActionCreators';
import * as p2pActions from '../redux/p2p/p2pActionCreators';
import * as metaActions from '../redux/metaActionCreators';

class Loop extends React.Component {
  state = {
    timer: null,
    countdown: 12,
  };

  componentDidMount() {
    this.props.getInitialBoard();
    this.startGame();
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

    this.props.handleChangeSnakeDirection(this.props.peerId, arrowKeyCodes[code]);
  };

  startGame = () => {
    if (!this.state.timer) { // so multiple calls don't result in multiple timers
      const timer = setInterval(this.tick, constants.LOOP_INTERVAL);
      this.setState({ timer });
    }
  };

  tick = () => {
    if (this.state.countdown > 0) {
      this.setState({ countdown: this.state.countdown - 1 });
    } else {
      this.props.handleTuTick(this.props.peerId);
    }
  };

  render() {
    let countdown = '';
    if (this.state.countdown > 0) {
      const num = Math.ceil((this.state.countdown * constants.LOOP_INTERVAL) / 1000);
      countdown = <span className='label alert-text'>Game starts in {num}</span>;
    }
    return (
      <div id='loop'>
        <div id='messages'>
          {countdown}
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
  handleTuTick: (id) => {
    dispatch(metaActions.handleTuTick(id));
  },
  handleChangeSnakeDirection: (id, direction) => {
    dispatch(snakeActions.handleChangeSnakeDirection(id, direction));
  },
  getInitialBoard: () => {
    dispatch(boardActions.getInitialBoard());
  },
  p2pBroadcastGameStatus: (status) => {
    dispatch(p2pActions.p2pBroadcastGameStatus(status));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Loop);
