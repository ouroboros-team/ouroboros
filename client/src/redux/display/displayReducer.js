import store from '../store';
import * as actionTypes from '../actionTypes';
import * as helpers from '../metaHelpers';
import * as displayHelpers from './displayHelpers';
import * as constants from '../../constants';

export default function displayReducer(state = {}, action) {
  switch (action.type) {
    case actionTypes.GET_INITIAL_DISPLAY_BOARD: {
      const model = store.getState().boards[constants.INITIAL_TU] || {};
      if (model){
        return helpers.deepClone(model);
      }
      return state;
    }
    case actionTypes.GET_NEXT_DISPLAY_BOARD: {
      return displayHelpers.getNextDisplayBoard();
    }
    default: {
      return state;
    }
  }
}
