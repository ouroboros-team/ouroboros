import * as actionTypes from './actionTypes';
import * as helpers from './snakeHelpers';

const defaultState = {
  tu: 0, // time unit
  snakes: [
    {
      id: 0,
      direction: 'left',
      status: 'alive',
      position: [
        {row: 5, column: 5},
        {row: 5, column: 6},
        {row: 4, column: 6},
        {row: 4, column: 5},
      ]
    },
    {
      id: 1,
      direction: 'down',
      status: 'alive',
      position: [
        {row: 3, column: 0},
        {row: 2, column: 0},
        {row: 1, column: 0},
        {row: 0, column: 0},
      ]
    },
    {
      id: 2,
      direction: 'right',
      status: 'alive',
      position: [
        {row: 1, column: 4},
        {row: 1, column: 3},
        {row: 2, column: 3},
        {row: 2, column: 4},
      ]
    },
    {
      id: 3,
      direction: 'up',
      status: 'alive',
      position: [
        {row: 6, column: 8},
        {row: 7, column: 8},
        {row: 8, column: 8},
        {row: 9, column: 8},
      ]
    },
  ]
};

export default function snakesReducer(state = defaultState, action) {
  switch (action.type) {
    case actionTypes.RECKON_NEXT_TU: {
      const nextState = {...state};

      nextState.snakes = [...nextState.snakes].map((snake) =>{
        return helpers.dead_reckon_next_coordinates(snake);
      });

      // increment TU
      nextState.tu += 1;

      return nextState;
    }
    case actionTypes.CHANGE_SNAKE_DIRECTION: {
      const info = helpers.getSnakeAndIndexById(state.snakes, action.id);
      const snake = info[0];
      const index = info[1];

      if(snake === undefined){
        return state;
      }

      const nextSnake = helpers.change_direction(snake, action.direction);

      const nextState = {...state};
      nextState.snakes = [...nextState.snakes];
      nextState.snakes[index] = nextSnake;

      return nextState;
    }
    case actionTypes.CHANGE_SNAKE_STATUS: {
      const info = helpers.getSnakeAndIndexById(state.snakes, action.id);
      const snake = info[0];
      const index = info[1];

      if(snake === undefined){
        return state;
      }

      const nextSnake = {...snake, status: action.status};

      const nextState = {...state};
      nextState.snakes = [...nextState.snakes];
      nextState.snakes[index] = nextSnake;

      return nextState;
    }
    default: {
      return state;
    }
  }
}
