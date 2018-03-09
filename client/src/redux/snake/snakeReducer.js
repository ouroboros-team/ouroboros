import * as actionTypes from '../actionTypes';
import * as snakeHelpers from './snakeHelpers';
import * as helpers from '../metaHelpers';

const defaultState = {
  0: {
    direction: 'left',
    status: 'alive',
    positions: [ // queue
      { row: 5, column: 5, tu: 7 },
      { row: 5, column: 6, tu: 6 },
      { row: 4, column: 6, tu: 5 },
      { row: 4, column: 7, tu: 4 },
      { row: 4, column: 8, tu: 3 },
      { row: 4, column: 9, tu: 2 },
      { row: 4, column: 10, tu: 1 },
      { row: 4, column: 11, tu: 0 },
    ],
  },
  1: {
    direction: 'right',
    status: 'alive',
    positions: [ // queue
      { row: 0, column: 9, tu: 6 },
      { row: 0, column: 8, tu: 5 },
      { row: 0, column: 7, tu: 4 },
      { row: 1, column: 7, tu: 3 },
      { row: 2, column: 7, tu: 2 },
      { row: 3, column: 7, tu: 1 },
      { row: 4, column: 7, tu: 0 },
    ],
  }
};

export default function snakesReducer(state = defaultState, action) {
  switch (action.type) {
    case actionTypes.CHANGE_SNAKE_DIRECTION: {
      if (!snakeHelpers.validateDirectionChange(state[action.id].direction, action.direction)) {
        return state;
      }

      const newState = helpers.deepClone(state);
      newState[action.id].direction = action.direction;
      return newState;
    }
    case actionTypes.UPDATE_PEER_SNAKE_DATA: {
      const id = Number(action.id);

      // if no snake data is held for this snake, simply add received data
      if (!state[id]) {
        const newState = helpers.deepClone(state);
        newState[id] = action.data;
        return newState;
      }

      const mostRecentTu = Number(state[id].positions[0].tu);
      const newDataTu = Number(action.data.positions[0].tu);

      // if data TU is more recent than most recent TU for this snake,
      // incorporate new data
      if (newDataTu > mostRecentTu) {
        const newState = helpers.deepClone(state);
        snakeHelpers.updateSnakeDataMutate(newState[id], action.data);
        return newState;
      }

      return state;
    }
    default: {
      return state;
    }
  }
}
