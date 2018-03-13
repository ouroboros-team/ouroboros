import * as displayActions from './display/displayActionCreators';
import * as boardActions from './board/boardActionCreators';
import * as infoActions from './info/infoActionCreators';
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
