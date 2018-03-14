import * as actionTypes from '../actionTypes';
import * as constants from '../../constants';
import * as metaHelpers from '../metaHelpers';

const defaultState = {
  tu: constants.INITIAL_TU,
  gameStatus: constants.GAME_STATUS_LOBBY,
};

export default function infoReducer(state = defaultState, action) {
  switch (action.type) {
    case actionTypes.INCREMENT_TU: {
      const newState = metaHelpers.deepClone(state);
      newState.tu += 1;
      return newState;
    }
    case actionTypes.UPDATE_GAME_STATUS: {
      const newState = metaHelpers.deepClone(state);
      newState.gameStatus = action.status;
      if (action.status === constants.GAME_STATUS_LOBBY) {
        newState.tu = 0;
      }
      return newState;
    }
    default: {
      return state;
    }
  }
}
