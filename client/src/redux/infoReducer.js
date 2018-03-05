import * as actionTypes from './actionTypes';

const defaultState = {
  tu: 0,
  playerList: [],
  gameStatus: 'pregame',
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
