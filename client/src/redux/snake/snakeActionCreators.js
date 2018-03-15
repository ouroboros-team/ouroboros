import store from '../store';
import * as actionTypes from '../actionTypes';
import * as snakeHelpers from './snakeHelpers';
import * as p2pActions from '../p2p/p2pActionCreators';
import * as helpers from '../metaHelpers';
import * as constants from '../../constants';

export const changeSnakeDirection = (id, direction) => ({
  id,
  direction,
  type: actionTypes.CHANGE_SNAKE_DIRECTION,
});

export const changeSnakeStatus = (id, status) => ({
  id,
  status,
  type: actionTypes.CHANGE_SNAKE_STATUS,
});

export const handleChangeSnakeDirection = (id, direction) => (
  (dispatch) => {
    dispatch(changeSnakeDirection(id, direction));
    p2pActions.p2pBroadcastSnakeData();
  }
);

export const updateSnakeData = (id, data) => ({
  id,
  data,
  type: actionTypes.UPDATE_SNAKE_DATA,
});

export const resetSnakeData = () => ({
  type: actionTypes.RESET_SNAKE_DATA,
});

export const initializeOwnSnake = id => (
  (dispatch) => {
    const row = helpers.randomUniqueRow();
    const positions = snakeHelpers.setStartPosition(row);
    const snake = snakeHelpers.emptySnakeObject(positions);

    dispatch(updateSnakeData(id, snake));
    p2pActions.p2pBroadcastSnakeData();
  }
);

export const writeOwnSnakePosition = id => (
  (dispatch) => {
    const state = store.getState();
    const newSnake = helpers.deepClone(state.snakes[id]);
    const lastTu = Number(newSnake.positions.byIndex[0]);

    const coords = snakeHelpers.calculateNextCoords(newSnake.direction, newSnake.positions.byKey[`${lastTu}`]);

    newSnake.positions.byKey = {};
    newSnake.positions.byKey[`${lastTu + 1}`] = coords;
    newSnake.positions.byIndex = [ `${lastTu + 1}` ];

    dispatch(updateSnakeData(id, newSnake));
    p2pActions.p2pBroadcastSnakeData();
  }
);

export const coordinatesMatch = (coordsA, coordsB) => (
  coordsA.row === coordsB.row && coordsA.column === coordsB.column
);

export const checkForCollisions = id => (
  (dispatch) => {
    const snakes = store.getState().snakes;
    const mySnake = snakes[id];
    const myLastTU = Number(mySnake.positions.byIndex[0]);
    const TUsAndCoords = {};

    for (let i = 0; i < constants.NUMBER_CANDIDATE_TUS; i++) {
      TUsAndCoords[myLastTU - i] = mySnake.positions.byKey[myLastTU - i];
    }

    // candidate tus are myLastTU to myLastTU - NUMBER_CANDIDATE_TUS + 1
    let headTUCounter = myLastTU;
    while (headTUCounter > myLastTU - constants.NUMBER_CANDIDATE_TUS) {
      const myHeadCoordsAtTU = mySnake.positions.byKey[headTUCounter];
      const snakeLength = snakeHelpers.getSnakeLength(headTUCounter);
      Object.keys(snakes).forEach((snakeID) => {
        // range is headTUCounter to headTUCounter - snakeLength + 1
        let counter = headTUCounter;
        while (counter > headTUCounter - snakeLength) {
          const snakeCoordsAtTU = snakes[snakeID].positions.byKey[counter];
          if (snakeCoordsAtTU && (Number(counter) !== Number(headTUCounter) || snakeID !== id)) {
            if (coordinatesMatch(myHeadCoordsAtTU, snakeCoordsAtTU)) {
              console.log(`COLLISION DETECTED between ${snakeID} and ${id} at row:${myHeadCoordsAtTU.row} and column:${myHeadCoordsAtTU.column} for candidate tu ${headTUCounter} and tu ${counter}`);
            }
          }

          counter -= 1;
        }
      });
      headTUCounter -= 1;
    }
  }
);

