import * as actionTypes from '../actionTypes';
import * as headSetHelpers from './headSetHelpers';
import * as helpers from '../metaHelpers';

export const defaultState = {
  newest: 0,
  oldest: -3,
  byKey: {},
};

function headSetReducer(state = defaultState, action) {
  switch (action.type) {
    case actionTypes.UPDATE_HEAD_SETS: {
      const newState = helpers.deepClone(state);

      if (action.id) {
        // only aggregate for snakes[action.id]
        headSetHelpers.updateSnakeHeadSets(newState, action.id, action.snake, action.gap);
      } else {
        // aggregate for all snakes (before game begins)
        headSetHelpers.updateAllHeadSets(newState);
      }

      return newState;
    }
    case actionTypes.PATCH_HEAD_SET: {
      const newState = helpers.deepClone(state);

      headSetHelpers.patchHeadSetMutate(newState, action.tu, action.sqNum, action.id);

      return newState;
    }
    case actionTypes.RESET_HEAD_SETS: {
      return defaultState;
    }
    default: {
      return state;
    }
  }
}

// exported here as workaround for testing bug
export default headSetReducer;
