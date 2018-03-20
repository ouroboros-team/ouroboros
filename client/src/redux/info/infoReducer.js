import * as actionTypes from '../actionTypes';
import * as constants from '../../constants';

const defaultState = {
  tu: constants.INITIAL_TU,
  gameStatus: constants.GAME_STATUS_LOBBY,
  startingRows: [],
};

export default function infoReducer(state = defaultState, action) {
  switch (action.type) {
    case actionTypes.INCREMENT_TU: {
      const newState = { ...state };
      newState.tu += 1;
      return newState;
    }
    case actionTypes.SET_TU: {
      const newState = { ...state };
      newState.tu = action.tu;
      return newState;
    }
    case actionTypes.UPDATE_GAME_STATUS: {
      if (state.gameStatus === action.status) {
        return state;
      }

      const newState = { ...state };
      newState.gameStatus = action.status;

      return newState;
    }
    case actionTypes.UPDATE_STARTING_ROWS: {
      const newState = { ...state };
      newState.startingRows.push(action.row);
      return newState;
    }
    case actionTypes.RESET_STARTING_ROWS: {
      const newState = { ...state };
      newState.startingRows = [];
      return newState;
    }
    default: {
      return state;
    }
  }
}
