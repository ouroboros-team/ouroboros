import * as actionTypes from './actionTypes';
import * as displayHelpers from './displayHelpers';

export default function displayReducer(state = {}, action) {
  switch (action.type) {
    case actionTypes.GET_NEXT_DISPLAY_BOARD: {
      return displayHelpers.getNextDisplayBoard();
    }
    default: {
      return state;
    }
  }
}
