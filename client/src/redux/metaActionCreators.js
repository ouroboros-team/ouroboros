import * as displayActions from './display/displayActionCreators';
import * as infoActions from './info/infoActionCreators';
import * as snakeActions from './snake/snakeActionCreators';

export const handleTuTick = id => (
  (dispatch) => {
    // write/broadcast own snake position
    dispatch(snakeActions.writeOwnSnakePosition(id));
    // increment TU
    dispatch(infoActions.incrementTu());
    // get next display board
    dispatch(displayActions.getNextDisplayBoard());
  }
);

export const receiveSnakeData = (id, data) => (
  (dispatch) => {
    dispatch(snakeActions.updateSnakeData(id, data));
  }
);

export const resetGameData = () => (
  (dispatch) => {
    dispatch(snakeActions.resetSnakeData());
    dispatch(displayActions.resetDisplayData());
  }
);