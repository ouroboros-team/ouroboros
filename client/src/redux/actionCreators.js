import * as actionTypes from './actionTypes';
import * as helpers from './snakeHelpers';

export function updateBoard() {
  return {
    type: actionTypes.UPDATE_BOARD
  };
}

export function resolveCollisions() {
  return (dispatch) => {
    const deadSnakes = helpers.collisionCheck();
    deadSnakes.forEach((snakeId) => {
      dispatch(changeSnakeStatus(snakeId, 'dead'));

      // todo: change to allow tie
      // currently in case of simultaneous death,
      // snake with higher index becomes winner
      if(helpers.gameOverCheck()) {
        dispatch(gameOver());
      }
    });
  }
}

export function reckonNextTu() {
  return {
    type: actionTypes.RECKON_NEXT_TU
  };
}

export function reckonAndUpdate() {
  return (dispatch) => {
    dispatch(reckonNextTu());
    dispatch(updateBoard());
    dispatch(resolveCollisions());
  }
}

export function changeSnakeDirection(id, direction) {
  return {
    type: actionTypes.CHANGE_SNAKE_DIRECTION,
    id,
    direction
  };
}

export function changeSnakeStatus(id, status){
  return {
    type: actionTypes.CHANGE_SNAKE_STATUS,
    id,
    status
  }
}

export function gameOver(){
  return {
    type: actionTypes.GAME_OVER,
  }
}

export function changeStatusCheckGameOver(id, status){
  return (dispatch) => {
    dispatch(changeSnakeStatus(id, status));
    if(helpers.gameOverCheck()) {
      dispatch(gameOver());
    }
  }
}
