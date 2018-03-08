import store from '../store';
import * as actionTypes from '../actionTypes';
import * as helpers from '../metaHelpers';
import * as displayHelpers from './displayHelpers';

export default function displayReducer(state = {}, action) {
  switch (action.type) {
    case actionTypes.GET_INITIAL_DISPLAY_BOARD: {
      return helpers.deepClone(store.getState().board);
    }
    case actionTypes.GET_NEXT_DISPLAY_BOARD: {
      return displayHelpers.getNextDisplayBoard();
    }
    default: {
      return state;
    }
  }
}
