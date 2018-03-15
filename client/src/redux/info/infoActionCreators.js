import * as actionTypes from '../actionTypes';
import * as p2pActions from '../p2p/p2pActionCreators';
import * as constants from '../../constants';
import * as metaActions from '../metaActionCreators';

export const incrementTu = () => ({
  type: actionTypes.INCREMENT_TU,
});

export const updateGameStatus = status => ({
  status,
  type: actionTypes.UPDATE_GAME_STATUS,
});

export const handleGameStatusChange = newStatus => (
  (dispatch) => {
    dispatch(updateGameStatus(newStatus));

    switch (newStatus) {
      case constants.GAME_STATUS_PREGAME: {
        break;
      }
      case constants.GAME_STATUS_READY_TO_PLAY: {
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
