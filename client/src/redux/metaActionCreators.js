import * as constants from '../constants';

import * as boardActions from './board/boardActionCreators';
import * as displayActions from './display/displayActionCreators';
import * as infoActions from './info/infoActionCreators';
import * as p2pActions from './p2p/p2pActionCreators';
import * as snakeActions from './snake/snakeActionCreators';

export const handleTuTick = id => (
  (dispatch) => {
    // write/broadcast own snake position
    dispatch(snakeActions.writeOwnSnakePosition(id));
    // aggregate own snake position into boards
    dispatch(boardActions.aggregateBoards(id));
    // increment TU
    dispatch(infoActions.incrementTu());
    // get next display board
    dispatch(displayActions.getNextDisplayBoard());
  }
);

export const receiveSnakeData = (id, data) => (
  (dispatch) => {
    dispatch(snakeActions.updateSnakeData(id, data));
    dispatch(boardActions.aggregateBoards(id));
  }
);

export const resetGameData = () => (
  (dispatch) => {
    dispatch(snakeActions.resetSnakeData());
    dispatch(displayActions.resetDisplayData());
    dispatch(boardActions.resetBoardData());
  }
)
