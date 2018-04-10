import cloneDeep from 'lodash/cloneDeep';

import store from '../store';
import * as actionTypes from '../actionTypes';
import * as snakeHelpers from './snakeHelpers';
import * as p2pHelpers from '../p2p/p2pHelpers';

// {
//   id: {
//     direction: 'left',
//     previousDirection: 'up',
//     tuOfDeath: null,
//     styleId: 0,
//     positions: {
//       byIndex: [4, 3, 2, 1, 0, -1, -2, -3],
//       byKey: {
//         4: { row: 5, column: 5 },
//         3: { row: 5, column: 6 },
//         2: { row: 4, column: 6 },
//         1: { row: 4, column: 7 },
//         0: { row: 4, column: 8 },
//         -1: { row: 4, column: 9 },
//         -2: { row: 4, column: 10 },
//         -3: { row: 4, column: 11 },
//       },
//     },
//   },
// };

function snakesReducer(state = {}, action) {
  switch (action.type) {
    case actionTypes.CHANGE_SNAKE_DIRECTION: {
      // check against last committed direction (not last direction key press)
      const previousDirection = state[action.id].previousDirection || state[action.id].direction;

      if (!snakeHelpers.validateDirectionChange(previousDirection, action.direction)) {
        return state;
      }

      const newState = { ...state };
      newState[action.id] = { ...newState[action.id] };
      newState[action.id].direction = action.direction;
      return newState;
    }
    case actionTypes.SET_TU_OF_DEATH: {
      if (!state[action.id] || state[action.id].tuOfDeath) {
        return state;
      }

      const newState = { ...state };
      newState[action.id] = { ...newState[action.id] };
      newState[action.id].tuOfDeath = action.tuOfDeath;
      return newState;
    }
    case actionTypes.UPDATE_SNAKE_DATA: {
      const newState = { ...state };

      // if no snake data is held for this snake, simply add received data
      if (!newState[action.id]) {
        newState[action.id] = action.data;
        // copy style id from p2p.peers (denormalized for speed)
        const peer = store.getState().p2p.peers[action.id];
        if (peer) {
          newState[action.id].styleId = peer.styleId;
        }
        return newState;
      }

      // update existing snake (only if new data is current or newer than existing data)
      if (action.data.positions.byIndex[0] >= newState[action.id].positions.byIndex[0]) {
        newState[action.id] = cloneDeep(newState[action.id]);

        snakeHelpers.updateSnakeDataMutate(newState[action.id], action.data);

        // if self, write direction to previousDirection
        // (allows direction changes to be validated against last committed move
        // instead of last arrow key pressed)
        if (action.id === p2pHelpers.getOwnId()) {
          newState[action.id].previousDirection = action.data.direction;
        }

        return newState;
      }

      return state;
    }
    case actionTypes.REMOVE_SNAKE: {
      const newState = { ...state };
      delete newState[action.id];
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

// exported here as workaround for testing bug
export default snakesReducer;
