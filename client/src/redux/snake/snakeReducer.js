import store from '../store';
import * as actionTypes from '../actionTypes';
import * as snakeHelpers from './snakeHelpers';
import * as helpers from '../metaHelpers';

// {
//   0: {
//     direction: 'left',
//     status: 'alive',
//     styleId: 0,
//     positions: {
//       '4': { row: 5, column: 5 },
//       '3': { row: 5, column: 6 },
//       '2': { row: 4, column: 6 },
//       '1': { row: 4, column: 7 },
//       '0': { row: 4, column: 8 },
//       '-1': { row: 4, column: 9 },
//       '-2': { row: 4, column: 10 },
//       '-3': { row: 4, column: 11 },
//     },
//   },
//   1: {
//     direction: 'right',
//     status: 'alive',
//     styleId: 1,
//     positions: {
//       '4': { row: 0, column: 9 },
//       '3': { row: 0, column: 8 },
//       '2': { row: 0, column: 7 },
//       '1': { row: 1, column: 7 },
//       '0': { row: 2, column: 7 },
//       '-1': { row: 3, column: 7 },
//       '-2': { row: 4, column: 7 },
//       '-3': { row: 4, column: 7 },
//     },
//   }
// };

export default function snakesReducer(state = {}, action) {
  switch (action.type) {
    case actionTypes.CHANGE_SNAKE_DIRECTION: {
      if (!snakeHelpers.validateDirectionChange(state[action.id].direction, action.direction)) {
        return state;
      }

      const newState = helpers.deepClone(state);
      newState[action.id].direction = action.direction;
      return newState;
    }
    case actionTypes.CHANGE_SNAKE_STATUS: {
      if (state[action.id].status === action.status) {
        return state;
      }

      const newState = helpers.deepClone(state);
      newState[action.id].status = action.status;
      return newState;
    }
    case actionTypes.UPDATE_SNAKE_DATA: {
      // if no snake data is held for this snake, simply add received data
      if (!state[action.id]) {
        const newState = helpers.deepClone(state);
        newState[action.id] = action.data;
        // copy style id from p2p.peers (denormalized for speed)
        const styleId = store.getState().p2p.peers[action.id].styleId;
        newState[action.id].styleId = styleId;
        return newState;
      }

      const newState = helpers.deepClone(state);
      snakeHelpers.updateSnakeDataMutate(newState[action.id], action.data);
      return newState;
    }
    case actionTypes.RESET_SNAKE_DATA: {
      return {};
    }
    default: {
      return state;
    }
  }
}
