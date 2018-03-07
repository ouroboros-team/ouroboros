import * as actionTypes from './actionTypes';
import * as boardHelpers from './boardHelpers';

export default function boardReducer(state = {}, action) {
  switch (action.type) {
    case actionTypes.AGGREGATE_INITIAL_BOARD: {
      return boardHelpers.aggregateInitialBoard();
    }
    default: {
      return state;
    }
  }
}
