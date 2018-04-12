import cloneDeep from 'lodash/cloneDeep';

import store from '../store';

import * as actionTypes from '../actionTypes';
import * as infoActions from '../info/infoActionCreators';
import * as p2pActions from '../p2p/p2pActionCreators';
import * as metaActions from '../metaActionCreators';

import * as boardHelpers from '../board/boardHelpers';
import * as headSetHelpers from '../headSet/headSetHelpers';
import * as p2pHelpers from '../p2p/p2pHelpers';
import * as snakeHelpers from './snakeHelpers';

import * as constants from '../../constants';

/* eslint no-use-before-define: 0 */  // --> OFF

export const changeSnakeDirection = (id, direction) => ({
  id,
  direction,
  type: actionTypes.CHANGE_SNAKE_DIRECTION,
});

export const setTuOfDeath = (id, tuOfDeath) => ({
  id,
  tuOfDeath,
  type: actionTypes.SET_TU_OF_DEATH,
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
    const snakes = store.getState().snakes;
    const ownSnake = snakes[id];
    const lastTu = ownSnake.positions.newest;

    let ownHead;
    let board;
    let squareNumber;

    // check the most recent TUs, starting with the earliest in range
    let tuCounter = lastTu - (constants.NUMBER_CANDIDATE_TUS - 1);

    while (tuCounter <= lastTu) {
      ownHead = ownSnake.positions.byKey[tuCounter];

      // compare own head to other snakes and rest of own body
      board = {
        ...boardHelpers.aggregateBoard(tuCounter),
        ...boardHelpers.aggregateOwnSnake(tuCounter - 1),
      };
      squareNumber = headSetHelpers.coordsToSquareNumber(ownHead);

      // if coordinates occupied by living snake, there is a collision
      if (board[squareNumber] && snakeHelpers.snakeIsAlive(board[squareNumber].id)) {
        dispatch(metaActions.handleSnakeDeath(id, tuCounter));

        if (board[squareNumber].id !== p2pHelpers.getOwnId()) {
          // if not self, find tu at which peer snake's head was in this square,
          // then tell peers to patch this head set to make sure
          // that peer snake was not overwritten by your dead snake
          // (leaving a gap in the snake's body)
          const peerSnake = snakes[board[squareNumber].id];
          let tu = peerSnake.positions.newest;
          while (peerSnake.positions.byKey[tu] && headSetHelpers.coordsToSquareNumber(peerSnake.positions.byKey[tu]) !== squareNumber) {
            tu -= 1;
          }
          p2pActions.p2pBroadcastPatch(tu, squareNumber, board[squareNumber].id);
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
    const snakeIds = Object.keys(snakes);
    let mostRecentTu;

    snakeIds.forEach((id) => {
      mostRecentTu = snakes[id].positions.newest;

      if (snakeHelpers.snakeIsAlive(id, snakes, tu) &&
        tu - mostRecentTu > constants.LATENT_SNAKE_TOLERANCE) {
        console.log(`${id}'s latency is too great`);
        dispatch(p2pActions.p2pKillPeerSnake(id));
      }
    });
  }
);
