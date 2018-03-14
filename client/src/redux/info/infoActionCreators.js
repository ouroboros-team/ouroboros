import * as actionTypes from '../actionTypes';
import * as p2pActions from '../p2p/p2pActionCreators';
import * as constants from '../../constants';
import * as metaActions from '../metaActionCreators';
import { p2pBroadcastStartingRows } from '../p2p/p2pActionCreators';
import * as snakeActions from '../snake/snakeActionCreators';

export const incrementTu = () => ({
  type: actionTypes.INCREMENT_TU,
});

export const updateGameStatus = status => ({
  status,
  type: actionTypes.UPDATE_GAME_STATUS,
});

export const handleGameStatusChange = (newStatus, id) => (
  (dispatch) => {
    dispatch(updateGameStatus(newStatus));

    switch (newStatus) {
      case constants.GAME_STATUS_PREGAME: {
        // if new status is pregame, broadcast rows and initialize own snake
        p2pBroadcastStartingRows();
        dispatch(snakeActions.initializeOwnSnake(id));
        break;
      }
      case constants.GAME_STATUS_PLAYING: {
        p2pActions.p2pBroadcastSnakeData();
        break;
      }
      case constants.GAME_STATUS_POSTGAME: {
        break;
      }
      case constants.GAME_STATUS_LOBBY: {
        dispatch(metaActions.resetGameData());
        break;
      }
      default: {
        break;
      }
    }
  }
);
