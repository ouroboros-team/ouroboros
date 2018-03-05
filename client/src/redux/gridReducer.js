import * as actionTypes from "./actionTypes";
import store from './store';

// import { GRID_SIZE } from "../constants";

// function resetGrid(){
//   const result = [];
//   for (let r = 0; r < GRID_SIZE; r++){
//     result.push([]);
//     for (let c = 0; c < GRID_SIZE; c++){
//       result[r].push({
//         status: 'empty',
//         snakeId: undefined,
//       });
//     }
//   }
//   return result;
// }

function updateBoard(){
  const nextState = [];

  const snakes = store.getState().data.snakes;
  let square;

  snakes.forEach((snake) =>{
    snake.position.forEach((coordinates) => {
      if (nextState[coordinates.row] === undefined){
        nextState[coordinates.row] = [];
      }

      if (nextState[coordinates.row][coordinates.column] === undefined){
        nextState[coordinates.row][coordinates.column] = {};
      }

      square = nextState[coordinates.row][coordinates.column];

      let status = 'snake';
      if(snake.status === 'dead'){
        status = 'dead';
      }

      square.status = status;
      square.snakeId = snake.id;
    });
  });

  return nextState;
}

export default function gridReducer(state = [], action) {
  switch (action.type) {
    case actionTypes.UPDATE_BOARD: {
      return updateBoard();
    }
    default: {
      return state;
    }
  }
}
