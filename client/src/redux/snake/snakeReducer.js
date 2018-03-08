import * as actionTypes from '../actionTypes';
import * as snakeHelpers from './snakeHelpers';

const defaultState = {
  0: {
    direction: 'left',
    status: 'alive',
    body: [ // queue
      { row: 5, column: 5, tu: 7 },
      { row: 5, column: 6, tu: 6 },
      { row: 4, column: 6, tu: 5 },
      { row: 4, column: 7, tu: 4 },
    ],
    history: [ // queue
      { row: 4, column: 8, tu: 3 },
      { row: 4, column: 9, tu: 2 },
      { row: 4, column: 10, tu: 1 },
      { row: 4, column: 11, tu: 0 },
    ],
  },
  // 1: {
  //   direction: 'right',
  //   status: 'alive',
  //   body: [ // queue
  //     { row: 5, column: 10, tu: 7 },
  //     { row: 5, column: 9, tu: 6 },
  //     { row: 5, column: 8, tu: 5 },
  //     { row: 5, column: 7, tu: 4 },
  //   ],
  //   history: [ // queue
  //     { row: 4, column: 7, tu: 3 },
  //     { row: 3, column: 7, tu: 2 },
  //     { row: 2, column: 7, tu: 1 },
  //     { row: 1, column: 7, tu: 0 },
  //   ],
  // }
};

export default function snakesReducer(state = defaultState, action) {
  switch (action.type) {
    case actionTypes.CHANGE_SNAKE_DIRECTION: {
      if (!snakeHelpers.validateDirectionChange(state[action.id].direction, action.direction)) {
        return state;
      }

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
