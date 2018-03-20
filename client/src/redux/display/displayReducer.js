import * as actionTypes from '../actionTypes';
import * as displayHelpers from './displayHelpers';

export default function displayReducer(state = {}, action) {
  switch (action.type) {
    case actionTypes.GET_INITIAL_DISPLAY_BOARD: {
      return displayHelpers.getInitialDisplayBoard();
    }
    case actionTypes.GET_NEXT_DISPLAY_BOARD: {
      return displayHelpers.buildNextDisplayBoard();
    }
    case actionTypes.RESET_DISPLAY_DATA: {
      return {};
    }
    default: {
      return state;
    }
  }
}
