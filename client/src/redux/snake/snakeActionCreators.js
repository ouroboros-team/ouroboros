import merge from 'lodash/merge';

import store from '../store';

import * as actionTypes from '../actionTypes';
import * as boardActions from '../board/boardActionCreators';
import * as infoActions from '../info/infoActionCreators';
import * as p2pActions from '../p2p/p2pActionCreators';

import * as displayHelpers from '../display/displayHelpers';
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
    newSnake.positions.byIndex = [`${lastTu + 1}`];

    dispatch(updateSnakeData(id, newSnake));
    dispatch(boardActions.updateBoards(id, newSnake));
    p2pActions.p2pBroadcastSnakeData();
  }
);

export const coordinatesMatch = (coordsA, coordsB) => (
  coordsA.row === coordsB.row && coordsA.column === coordsB.column
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
    const ownSnake = store.getState().snakes[id];
    const lastTu = Number(ownSnake.positions.byIndex[0]);

    let ownHead;
    let board;
    let length;
    let collisionType;

    // check the most recent TUs, starting with the earliest in range
    let tuCounter = lastTu - (constants.NUMBER_CANDIDATE_TUS - 1);

    while (tuCounter <= lastTu) {
      ownHead = ownSnake.positions.byKey[tuCounter];
      // compare own head to other snakes and rest of own body
      board = merge(displayHelpers.aggregateBoards(tuCounter), displayHelpers.aggregateOwnSnake(tuCounter - 1));
      length = snakeHelpers.getSnakeLength(tuCounter);

      if (board[ownHead.row] && board[ownHead.row][ownHead.column]) {
        // collision
        dispatch(changeSnakeStatus(id, constants.SNAKE_STATUS_DEAD));
        p2pActions.p2pBroadcastSnakeData();

        // check collision type
        collisionType = getCollisionType(ownHead, id, board[ownHead.row][ownHead.column].id, length);
        console.log(collisionType);

        if (collisionType === constants.COLLISION_TYPE_HEAD_ON_HEAD) {
          // other snake is also dead
          dispatch(changeSnakeStatus(board[ownHead.row][ownHead.column].id, constants.SNAKE_STATUS_DEAD));
          p2pActions.p2pBroadcast(board[ownHead.row][ownHead.column].snake);
        }
      }

      tuCounter += 1;
    }
  }
);

export const checkForGameOver = () => (
  (dispatch) => {
    const snakes = store.getState().snakes;
    const snakeIds = Object.keys(snakes);
    const count = snakeIds.length;

    const snakesAlive = snakeIds.reduce((acc, id) => {
      if (snakes[id].status === constants.SNAKE_STATUS_ALIVE) {
        return acc + 1;
      }
      return acc;
    }, 0);

    if ((count === 1 && snakesAlive === 0) || (count > 1 && snakesAlive <= 1)) {
      dispatch(p2pActions.p2pBroadcastGameStatus(constants.GAME_STATUS_POSTGAME));
    }
  }
);
