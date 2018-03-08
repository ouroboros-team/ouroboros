import * as actionTypes from '../actionTypes';
import * as constants from '../../constants';

const defaultState = {
  tu: 7,
  playerList: [],
  gameStatus: constants.GAME_STATUS_PREGAME,
};

export default function infoReducer(state = defaultState, action) {
  switch (action.type) {
    case actionTypes.INCREMENT_TU: {
      const newState = { ...state };
      newState.tu += 1;
      return newState;
    }
    default: {
      return state;
    }
  }
}
