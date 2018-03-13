import * as actionTypes from '../actionTypes';
import * as p2pActions from '../actionCreators';
import * as constants from '../../constants';

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
      case constants.GAME_STATUS_PLAYING: {
        p2pActions.p2pBroadcastSnakeData();
        break;
      }
      case constants.GAME_STATUS_LOBBY:
      case constants.GAME_STATUS_POSTGAME:
      default: {
        break;
      }
    }
  }
);
