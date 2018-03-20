import * as actionTypes from '../actionTypes';
import * as headSetHelpers from './headSetHelpers';
import * as helpers from '../metaHelpers';

export default function headSetReducer(state = {}, action) {
  switch (action.type) {
    case actionTypes.UPDATE_HEAD_SETS: {
      const newState = helpers.deepClone(state);

      if (action.id) {
        // only aggregate for snakes[action.id]
        headSetHelpers.updateHeadSets(newState, action.id, action.snake);
      } else {
        // aggregate for all snakes (before game begins)
        headSetHelpers.updateAllHeadSets(newState);
      }

      return newState;
    }
    case actionTypes.RESET_HEAD_SETS: {
      return {};
    }
    default: {
      return state;
    }
  }
}
