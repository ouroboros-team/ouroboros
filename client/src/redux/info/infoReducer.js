import * as actionTypes from '../actionTypes';
import * as constants from '../../constants';

const defaultState = {
  tu: constants.INITIAL_TU,
  gameStatus: constants.GAME_STATUS_LOBBY,
  startingRows: [],
  winner: '',
};

export default function infoReducer(state = defaultState, action) {
  switch (action.type) {
    case actionTypes.INCREMENT_TU: {
      const newState = { ...state };
      newState.tu += 1;
      return newState;
    }
    case actionTypes.UPDATE_GAME_STATUS: {
      if (state.gameStatus === action.status) {
        return state;
      }

      const newState = { ...state };
      newState.gameStatus = action.status;

      // also set TU to 0 if status is lobby
      if (action.status === constants.GAME_STATUS_LOBBY) {
        newState.tu = 0;
      }

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
    case actionTypes.UPDATE_WINNER: {
      const newState = { ...state };
      newState.winner = action.winner;
      return newState;
    }
    default: {
      return state;
    }
  }
}
