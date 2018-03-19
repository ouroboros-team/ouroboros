import store from '../store';
import * as actionTypes from '../actionTypes';
import * as helpers from '../metaHelpers';
import * as boardHelpers from '../board/boardHelpers';
import * as displayHelpers from './displayHelpers';
import * as snakeHelpers from '../snake/snakeHelpers';
import * as p2pActions from '../p2p/p2pActionCreators';
import * as infoActions from '../info/infoActionCreators';
import * as constants from '../../constants';

export const getInitialDisplayBoard = () => ({
  type: actionTypes.GET_INITIAL_DISPLAY_BOARD,
});

export const getNextDisplayBoard = board => ({
  board,
  type: actionTypes.GET_NEXT_DISPLAY_BOARD,
});

export const buildNextDisplayBoard = () => (
  (dispatch) => {
    const state = store.getState();
    const tu = state.info.tu;
    const newBoard = displayHelpers.aggregateBoards(tu);

    // combine boards needed for current snake length - 1
    // (predicted move will make full snake length)

    const snakesObj = helpers.deepClone(state.snakes);
    const snakeIds = Object.keys(snakesObj);

    const length = snakeHelpers.getSnakeLength(tu);
    const aliveSnakes = [];

    let snake;
    let mostRecentTu;
    let next;

    // predict next moves, fill in missing data with predictions
    snakeIds.forEach((id) => {
      if (snakeHelpers.snakeIsAlive(id)) {
        snake = snakesObj[id];
        aliveSnakes.push(id);
        mostRecentTu = Number(snake.positions.byIndex[0]);

        // run once for all snakes, more for snakes with missing TUs
        while (mostRecentTu < tu) {
          // calculate next coordinates (predicted)
          next = snakeHelpers.calculateNextCoords(snake.direction, snake.positions.byKey[`${mostRecentTu}`]);

          mostRecentTu += 1;

          // add predicted coordinates to cloned snake object
          snake.positions.byKey[`${mostRecentTu}`] = next;
          snake.positions.byIndex.unshift(`${mostRecentTu}`);

          // add next position to newBoard if it is within range
          // (based on target TU and snake length)
          if (mostRecentTu <= tu && mostRecentTu > tu - length) {
            boardHelpers.addCoordinatesMutate(newBoard, next, snake, id);
          }
        }
      }
    });

    if ((aliveSnakes.length < 2 && snakeIds.length > 1) ||
        (aliveSnakes.length < 1 && snakeIds.length < 2)) {
      const id = aliveSnakes[0];
      const winner = id ? store.getState().p2p.peers[id].username : constants.GAME_RESULT_TIE;
      p2pActions.p2pBroadcast({ winner });
      dispatch(infoActions.updateWinner(winner));

      dispatch(p2pActions.p2pBroadcastGameStatus(constants.GAME_STATUS_POSTGAME));
    }

    if (newBoard) {
      dispatch(getNextDisplayBoard(newBoard));
    }
  }
);

export const resetDisplayData = () => ({
  type: actionTypes.RESET_DISPLAY_DATA,
});
