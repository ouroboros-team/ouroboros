import cloneDeep from 'lodash/cloneDeep';

import store from '../store';

import * as actionTypes from '../actionTypes';
import * as infoActions from '../info/infoActionCreators';
import * as metaActions from '../metaActionCreators';
import * as p2pActions from '../p2p/p2pActionCreators';

import * as boardHelpers from '../board/boardHelpers';
import * as p2pHelpers from '../p2p/p2pHelpers';
import * as headSetHelpers from '../headSet/headSetHelpers';
import * as snakeHelpers from './snakeHelpers';

import * as constants from '../../constants';

/* eslint no-use-before-define: 0 */  // --> OFF

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

export const handleChangeSnakeStatus = (id, status) => (
  (dispatch) => {
    dispatch(changeSnakeStatus(id, status));
    if (id === p2pHelpers.getOwnId()) {
      p2pActions.p2pBroadcastSnakeData();
    }

    const result = snakeHelpers.checkForGameOver();

    if (result !== false) {
      dispatch(metaActions.declareGameOver(result));
    }
  }
);

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

export const handleUpdateSnakeData = (id, data) => (
  (dispatch) => {
    if (data.status === constants.SNAKE_STATUS_DEAD) {
      dispatch(handleChangeSnakeStatus(id, data.status));
    }

    dispatch(updateSnakeData(id, data));
  }
);

export const removeSnake = id => ({
  id,
  type: actionTypes.REMOVE_SNAKE,
});

export const resetSnakeData = () => ({
  type: actionTypes.RESET_SNAKE_DATA,
});

export const initializeOwnSnake = (id, row) => (
  (dispatch) => {
    const startingRow = row || dispatch(infoActions.getAvailableRow());

    const positions = snakeHelpers.setStartPosition(startingRow);
    const snake = snakeHelpers.emptySnakeObject(positions);

    dispatch(updateSnakeData(id, snake));
    p2pActions.p2pBroadcastSnakeData();
  }
);

export const writeOwnSnakePosition = id => (
  (dispatch) => {
    const state = store.getState();
    const newSnake = cloneDeep(state.snakes[id]);
    const lastTu = newSnake.positions.newest;

    const coords = snakeHelpers.calculateNextCoords(newSnake.direction, newSnake.positions.byKey[`${lastTu}`]);

    newSnake.positions.byKey = {};
    newSnake.positions.byKey[`${lastTu + 1}`] = coords;
    newSnake.positions.newest = lastTu + 1;

    dispatch(updateSnakeData(id, newSnake));
    p2pActions.p2pBroadcastSnakeData();
  }
);

export const checkForCollisions = id => (
  (dispatch) => {
    const ownSnake = store.getState().snakes[id];
    const lastTu = ownSnake.positions.newest;

    let ownHead;
    let board;
    let length;
    let collisionType;
    let squareNumber;

    // check the most recent TUs, starting with the earliest in range
    let tuCounter = lastTu - (constants.NUMBER_CANDIDATE_TUS - 1);

    while (tuCounter <= lastTu) {
      ownHead = ownSnake.positions.byKey[tuCounter];

      // compare own head to other snakes and rest of own body
      board = {
        ...boardHelpers.aggregateBoards(tuCounter),
        ...boardHelpers.aggregateOwnSnake(tuCounter - 1),
      };
      length = snakeHelpers.getSnakeLength(tuCounter);
      squareNumber = headSetHelpers.coordsToSquareNumber(ownHead);

      // if coordinates occupied by living snake, there is a collision
      if (board[squareNumber] && snakeHelpers.snakeIsAlive(board[squareNumber].id)) {
        dispatch(handleChangeSnakeStatus(id, constants.SNAKE_STATUS_DEAD));
        // check collision type
        collisionType = snakeHelpers.getCollisionType(squareNumber, id, board[squareNumber].id, length);
        console.log(collisionType);

        if (collisionType === constants.COLLISION_TYPE_HEAD_ON_HEAD) {
          // other snake is also dead
          dispatch(p2pActions.p2pKillPeerSnake(board[squareNumber].id));
        } else {
          // tell peers to patch this head set to make sure other snake was not
          // overwritten by your dead snake (leaving a gap in the snake's body)
          p2pActions.p2pBroadcastPatch(tuCounter, squareNumber, board[squareNumber].id);
        }
        return;
      }

      tuCounter += 1;
    }
  }
);

export const checkForLatentSnakes = () => (
  (dispatch) => {
    const state = store.getState();
    const tu = state.info.tu;

    // only check once for every 10 TUs
    if (tu % 10 !== 0) {
      return;
    }

    const snakes = state.snakes;
    const snakeIds = Object.keys(state.snakes);
    let mostRecentTu;

    snakeIds.forEach((id) => {
      mostRecentTu = snakes[id].positions.newest;

      if (snakeHelpers.snakeIsAlive(id, snakes[id]) &&
        tu - mostRecentTu > constants.LATENT_SNAKE_TOLERANCE) {
        console.log(`${id}'s latency is too great`);
        dispatch(p2pActions.p2pKillPeerSnake(id));
      }
    });
  }
);
