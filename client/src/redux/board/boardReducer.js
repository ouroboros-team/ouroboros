import * as actionTypes from '../actionTypes';
import * as boardHelpers from './boardHelpers';

export default function boardReducer(state = {}, action) {
  switch (action.type) {
    case actionTypes.GET_INITIAL_BOARD: {
      return boardHelpers.getInitialBoard();
    }
    case actionTypes.GET_NEXT_BOARD: {
      return boardHelpers.buildNextBoard();
    }
    case actionTypes.RESET_BOARD: {
      return {};
    }
    default: {
      return state;
    }
  }
}
