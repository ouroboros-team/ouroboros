import * as actionTypes from './actionTypes';
import * as snakeHelpers from './snakeHelpers';

const defaultState = {
  0: {
    direction: 'left',
    status: 'alive',
    body: [ // queue
      { row: 5, column: 5 },
      { row: 5, column: 6 },
      { row: 4, column: 6 },
      { row: 4, column: 7 },
    ],
    history: [ // queue
      { row: 4, column: 8 },
      { row: 4, column: 9 },
      { row: 4, column: 10 },
      { row: 4, column: 11 },
    ],
  },
  // 1: {
  //   direction: 'right',
  //   status: 'alive',
  //   body: [ // queue
  //     { row: 5, column: 10 },
  //     { row: 5, column: 9 },
  //     { row: 5, column: 8 },
  //     { row: 5, column: 7 },
  //   ],
  //   history: [ // queue
  //     { row: 4, column: 7 },
  //     { row: 3, column: 7 },
  //     { row: 2, column: 7 },
  //     { row: 1, column: 7 },
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
