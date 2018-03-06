import * as actionTypes from './actionTypes';
import * as helpers from './snakeHelpers';

const defaultState = {
  0: {
    direction: 'left',
    status: 'alive',
    position: [
      { row: 5, column: 5 },
      { row: 5, column: 6 },
      { row: 4, column: 6 },
      { row: 4, column: 7 },
    ],
  },
};

export default function snakesReducer(state = defaultState, action) {
  switch (action.type) {
    case actionTypes.CHANGE_SNAKE_DIRECTION: {
      const newState = { ...state };
      newState[action.id] = { ...newState[action.id] };
      newState[action.id].direction = action.direction;
      return newState;
    }
    default: {
      return state;
    }
  }
}
