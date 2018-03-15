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
//       byIndex: {
//         ['4', '3', '2', '1', '0', '-1', '-2', '-3']
//       }
//       byKey: {
//         '4': { row: 5, column: 5 },
//         '3': { row: 5, column: 6 },
//         '2': { row: 4, column: 6 },
//         '1': { row: 4, column: 7 },
//         '0': { row: 4, column: 8 },
//         '-1': { row: 4, column: 9 },
//         '-2': { row: 4, column: 10 },
//         '-3': { row: 4, column: 11 },
//       },
//     },
//   },
//   1: {
//     direction: 'right',
//     status: 'alive',
//     styleId: 1,
//     positions: {
//       byIndex: {
//         ['4', '3', '2', '1', '0', '-1', '-2', '-3']
//       }
//       byKey: {
//         '4': { row: 0, column: 9 },
//         '3': { row: 0, column: 8 },
//         '2': { row: 0, column: 7 },
//         '1': { row: 1, column: 7 },
//         '0': { row: 2, column: 7 },
//         '-1': { row: 3, column: 7 },
//         '-2': { row: 4, column: 7 },
//         '-3': { row: 4, column: 7 },
//       },
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
      const newState = helpers.deepClone(state);
      const newSnake = newState[action.id];

      // if no snake data is held for this snake, simply add received data
      if (!newSnake) {
        newState[action.id] = action.data;
        // copy style id from p2p.peers (denormalized for speed)
        newState[action.id].styleId = store.getState().p2p.peers[action.id].styleId;
        return newState;
      }

      // update existing snake, if newer data received
      if (Number(action.data.positions.byIndex[0]) > Number(newSnake.positions.byIndex[0])) {
        snakeHelpers.updateSnakeDataMutate(newSnake, action.data);
        return newState;
      }

      return state;
    }
    case actionTypes.RESET_SNAKE_DATA: {
      return {};
    }
    default: {
      return state;
    }
  }
}
