import store from '../store';

import * as actionTypes from '../actionTypes';
import * as infoActions from '../info/infoActionCreators';
import * as p2pActions from '../p2p/p2pActionCreators';

import * as snakeHelpers from './snakeHelpers';
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
    if (snakeHelpers.snakeIsAlive(id)) {
      dispatch(changeSnakeDirection(id, direction));
      p2pActions.p2pBroadcastSnakeData();
    }
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

export const initializeOwnSnake = (id, row) => (
  (dispatch) => {
    const startingRow = row || dispatch(infoActions.randomUniqueRow());

    const positions = snakeHelpers.setStartPosition(startingRow);
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

export const isNotOwnHead = (tu1, tu2, id1, id2) => (
  Number(tu1) !== Number(tu2) || id1 !== id2
);

export const getCollisionType = (headCoords, myID, peerID, snakeLength) => {
  const peerSnake = store.getState().snakes[peerID];
  const peerHeadTU = peerSnake.positions.byIndex[0];
  const peerHeadCoords = peerSnake.positions.byKey[peerHeadTU];
  const peerTailTU = peerSnake.positions.byIndex[snakeLength - 1];
  const peerTailCoords = peerSnake.positions.byKey[peerTailTU - 1];
  if (myID !== peerID && coordinatesMatch(headCoords, peerHeadCoords)) {
    return constants.COLLISION_TYPE_HEAD_ON_HEAD;
  } else if (coordinatesMatch(headCoords, peerTailCoords)) {
    return constants.COLLISION_TYPE_HEAD_ON_TAIL;
  }

  return constants.COLLISION_TYPE_HEAD_ON_BODY;
};

export const checkForCollisions = id => (
  (dispatch) => {
    const snakes = store.getState().snakes;
    const mySnake = snakes[id];
    const myLastTU = Number(mySnake.positions.byIndex[0]);

    // candidate tus are myLastTU to myLastTU - NUMBER_CANDIDATE_TUS + 1
    let headTUCounter = myLastTU - (constants.NUMBER_CANDIDATE_TUS - 1);
    while (headTUCounter <= myLastTU) {
      const myHeadCoordsAtTU = mySnake.positions.byKey[headTUCounter];
      const snakeLength = snakeHelpers.getSnakeLength(headTUCounter);
      const snakeIDs = Object.keys(snakes);
      for (let i = 0; i < snakeIDs.length; i += 1) {
        const peerID = snakeIDs[i];
        const peerSnake = snakes[peerID];
        // range is headTUCounter to headTUCounter - snakeLength + 1
        let counter = headTUCounter;
        while (counter > headTUCounter - snakeLength &&
               peerSnake.status === constants.SNAKE_STATUS_ALIVE) {
          const snakeCoordsAtTU = peerSnake.positions.byKey[counter];
          if (snakeCoordsAtTU &&
            isNotOwnHead(counter, headTUCounter, id, peerID)) {
            if (coordinatesMatch(myHeadCoordsAtTU, snakeCoordsAtTU)) {
              const collisonType = getCollisionType(myHeadCoordsAtTU, id, peerID, snakeLength);
              dispatch(changeSnakeStatus(id, constants.SNAKE_STATUS_DEAD));
              if (collisonType === constants.COLLISION_TYPE_HEAD_ON_HEAD) {
                dispatch(changeSnakeStatus(peerID, constants.SNAKE_STATUS_DEAD));
              }

              console.log(collisonType);
            }
          }

          counter -= 1;
        }
      }

      headTUCounter += 1;
    }
  }
);
