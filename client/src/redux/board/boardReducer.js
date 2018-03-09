import * as actionTypes from '../actionTypes';
import * as boardHelpers from './boardHelpers';
import * as helpers from '../metaHelpers';
import * as constants from '../../constants';

export default function boardReducer(state = {}, action) {
  switch (action.type) {
    case actionTypes.AGGREGATE_INITIAL_BOARD: {
      const newState = helpers.deepClone(state);
      newState[constants.INITIAL_TU] = boardHelpers.aggregateInitialBoard();
      return newState;
    }
    default: {
      return state;
    }
  }
}
