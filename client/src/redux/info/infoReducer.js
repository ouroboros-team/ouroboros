import shuffle from 'lodash/shuffle';

import * as actionTypes from '../actionTypes';
import * as constants from '../../constants';

export const defaultState = {
  tu: constants.INITIAL_TU,
  gameStatus: constants.GAME_STATUS_LOBBY,
  availableRows: shuffle(Array(constants.GRID_SIZE).fill(null).map((_, i) => (i))),
  winner: '',
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
    case actionTypes.UPDATE_AVAILABLE_ROWS: {
      const newState = { ...state };
      newState.availableRows = action.availableRows;
      return newState;
    }
    case actionTypes.RESET_AVAILABLE_ROWS: {
      const newState = { ...state };
      newState.availableRows = shuffle(Array(constants.GRID_SIZE).fill(null).map((_, i) => (i)));
      return newState;
    }
    case actionTypes.UPDATE_WINNER: {
      const newState = { ...state };
      newState.winner = action.winner;
      return newState;
    }
    case actionTypes.RESET_WINNER: {
      const newState = { ...state };
      newState.winner = '';
      return newState;
    }
    default: {
      return state;
    }
  }
}
