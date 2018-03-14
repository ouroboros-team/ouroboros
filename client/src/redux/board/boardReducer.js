import * as actionTypes from '../actionTypes';
import * as boardHelpers from './boardHelpers';
import * as helpers from '../metaHelpers';

export default function boardReducer(state = {}, action) {
  switch (action.type) {
    case actionTypes.AGGREGATE_BOARDS: {
      const newState = helpers.deepClone(state);

      if (action.id) {
        // only aggregate for snakes[action.id]
        boardHelpers.aggregateBoards(newState, action.id);
      } else {
        // aggregate for all snakes (before game begins)
        boardHelpers.aggregateAllBoards(newState);
      }

      return newState;
    }
    case actionTypes.RESET_BOARD_DATA: {
      return {};
    }
    default: {
      return state;
    }
  }
}
