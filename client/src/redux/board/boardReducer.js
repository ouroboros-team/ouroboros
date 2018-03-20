import * as actionTypes from '../actionTypes';
import * as boardHelpers from './boardHelpers';
import * as p2pHelpers from '../p2p/p2pHelpers';
import * as helpers from '../metaHelpers';

export default function boardReducer(state = {}, action) {
  switch (action.type) {
    case actionTypes.UPDATE_BOARDS: {
      const newState = helpers.deepClone(state);

      if (action.id) {
        // only aggregate for snakes[action.id]
        boardHelpers.updateBoards(newState, action.id, action.snake);
      } else {
        // aggregate for all snakes (before game begins)
        boardHelpers.updateAllBoards(newState);
      }

      return newState;
    }
    case actionTypes.RESET_BOARDS: {
      return {};
    }
    default: {
      return state;
    }
  }
}
