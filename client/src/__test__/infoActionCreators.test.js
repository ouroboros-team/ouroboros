import store from '../redux/store';

import * as actionTypes from '../redux/actionTypes';

import * as headSetActions from '../redux/headSet/headSetActionCreators';
import * as infoActions from '../redux/info/infoActionCreators';
import * as metaActions from '../redux/metaActionCreators';

import * as snakeHelpers from '../redux/snake/snakeHelpers';

import * as constants from '../constants';

describe('Info action creators', () => {
  it('incrementTu returns expected object', () => {
    const obj = infoActions.incrementTu();
    expect(obj).toEqual({ type: actionTypes.INCREMENT_TU });
  });

  it('resetTu returns expected object', () => {
    const obj = infoActions.resetTu();
    expect(obj).toEqual({
      type: actionTypes.RESET_TU,
    });
  });

  it('updateAvailableRows returns expected object', () => {
    const availableRows = [ 38, 39 ];
    const obj = infoActions.updateAvailableRows(availableRows);
    expect(obj).toEqual({
      availableRows,
      type: actionTypes.UPDATE_AVAILABLE_ROWS,
    });
  });

  it('resetAvailableRows returns expected object', () => {
    const obj = infoActions.resetAvailableRows();
    expect(obj).toEqual({ type: actionTypes.RESET_AVAILABLE_ROWS });
  });

  it('updateGameStatus returns expected object', () => {
    const status = 'eilurbv';
    const obj = infoActions.updateGameStatus(status);
    expect(obj).toEqual({
      status,
      type: actionTypes.UPDATE_GAME_STATUS,
    });
  });

  it('updateWinner returns expected object', () => {
    const winner = 'priwontb';
    const obj = infoActions.updateWinner(winner);
    expect(obj).toEqual({
      winner,
      type: actionTypes.UPDATE_WINNER,
    });
  });

  it('resetWinner returns expected object', () => {
    const obj = infoActions.resetWinner();
    expect(obj).toEqual({ type: actionTypes.RESET_WINNER });
  });

  describe('getAvailableRow thunk', () => {
    const dispatchSpy = jest.fn();
    let initialState = {};

    beforeEach(() => {
      initialState = {
        info: {
          availableRows: [
            19, 30, 26, 27, 8, 16, 6, 37, 7, 21,
            32, 22, 31, 35, 15, 9, 38, 24, 14, 25,
            36, 20, 33, 12, 0, 5, 34, 11, 39, 1,
            13, 4, 3, 28, 2, 23, 29, 18, 10, 17,
          ],
        },
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('returns a function', () => {
      expect(typeof infoActions.getAvailableRow()).toBe('function');
    });

    it('calls dispatch with updateAvailableRows with new available rows as an argument', () => {
      const getStateSpy = jest.spyOn(store, 'getState').mockImplementation(() => (initialState));

      const availableRow = infoActions.getAvailableRow()(dispatchSpy);
      const newAvailableRows = initialState.info.availableRows.filter(row => (row !== availableRow));
      expect(getStateSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(infoActions.updateAvailableRows(newAvailableRows));
    });

    it('generates a row that is >= 0 and < GRID_SIZE', () => {
      jest.spyOn(store, 'getState').mockImplementation(() => (initialState));

      const row = infoActions.getAvailableRow()(dispatchSpy);
      const result = row >= 0 && row < constants.GRID_SIZE;
      expect(result).toBe(true);
    });

    it('generates a row that is in info.availableRows', () => {
      jest.spyOn(store, 'getState').mockImplementation(() => (initialState));

      const row = infoActions.getAvailableRow()(dispatchSpy);
      expect(initialState.info.availableRows.includes(row)).toBe(true);
    });
  });

  describe('handleGameStatusChange thunk', () => {
    let dispatchSpy;
    let state;
    const tu = 17;
    const dummyStatus = 'lkadjn';

    beforeEach(() => {
      dispatchSpy = jest.fn();
      state = { info: { tu } };
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('returns a function', () => {
      expect(typeof infoActions.handleGameStatusChange()).toBe('function');
    });

    it('does nothing if passed status is same as previous status', () => {
      state.info.gameStatus = dummyStatus;
      jest.spyOn(store, 'getState').mockImplementation(() => (state));

      infoActions.handleGameStatusChange(dummyStatus)(dispatchSpy);
      expect(dispatchSpy).not.toHaveBeenCalled();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('calls dispatch with updateGameStatus with out-of-sync as an argument as default behavior', () => {
      jest.spyOn(store, 'getState').mockImplementation(() => (state));

      infoActions.handleGameStatusChange(dummyStatus)(dispatchSpy);
      expect(dispatchSpy).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(infoActions.updateGameStatus(constants.GAME_STATUS_OUT_OF_SYNC));
    });

    // lobby
    it('updates game status to lobby if previous status was postgame', () => {
      const status = constants.GAME_STATUS_LOBBY;
      state.info.gameStatus = constants.GAME_STATUS_POSTGAME;
      jest.spyOn(store, 'getState').mockImplementation(() => (state));

      infoActions.handleGameStatusChange(status)(dispatchSpy);
      expect(dispatchSpy).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(infoActions.updateGameStatus(status));
    });

    it('updates game status to lobby if previous status was out-of-sync', () => {
      const status = constants.GAME_STATUS_LOBBY;
      state.info.gameStatus = constants.GAME_STATUS_OUT_OF_SYNC;
      jest.spyOn(store, 'getState').mockImplementation(() => (state));

      infoActions.handleGameStatusChange(status)(dispatchSpy);
      expect(dispatchSpy).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(infoActions.updateGameStatus(status));
    });

    it('does not update game status to lobby if previous status was not postgame or out-of-sync', () => {
      state.info.gameStatus = dummyStatus;
      const status = constants.GAME_STATUS_LOBBY;
      jest.spyOn(store, 'getState').mockImplementation(() => (state));

      infoActions.handleGameStatusChange(status)(dispatchSpy);
      expect(dispatchSpy).not.toHaveBeenCalledWith(infoActions.updateGameStatus(status));
      expect(dispatchSpy).toHaveBeenCalledWith(infoActions.updateGameStatus(constants.GAME_STATUS_OUT_OF_SYNC));
    });

    // pregame
    it('updates game status to pregame if previous status was lobby', () => {
      const status = constants.GAME_STATUS_PREGAME;
      state.info.gameStatus = constants.GAME_STATUS_LOBBY;
      jest.spyOn(store, 'getState').mockImplementation(() => (state));

      infoActions.handleGameStatusChange(status)(dispatchSpy);
      expect(dispatchSpy).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(infoActions.updateGameStatus(status));
    });

    it('does not update game status to pregame if previous status was not lobby', () => {
      const status = constants.GAME_STATUS_PREGAME;
      state.info.gameStatus = dummyStatus;
      jest.spyOn(store, 'getState').mockImplementation(() => (state));

      infoActions.handleGameStatusChange(status)(dispatchSpy);
      expect(dispatchSpy).not.toHaveBeenCalledWith(infoActions.updateGameStatus(status));
      expect(dispatchSpy).toHaveBeenCalledWith(infoActions.updateGameStatus(constants.GAME_STATUS_OUT_OF_SYNC));
    });

    // ready-to-play
    it('updates game status to ready-to-play if previous status was pregame', () => {
      const status = constants.GAME_STATUS_READY_TO_PLAY;
      state.info.gameStatus = constants.GAME_STATUS_PREGAME;
      jest.spyOn(store, 'getState').mockImplementation(() => (state));

      infoActions.handleGameStatusChange(status)(dispatchSpy);
      expect(dispatchSpy).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(infoActions.updateGameStatus(status));
    });

    it('does not update game status to ready-to-play if previous status was not pregame', () => {
      const status = constants.GAME_STATUS_READY_TO_PLAY;
      state.info.gameStatus = dummyStatus;
      jest.spyOn(store, 'getState').mockImplementation(() => (state));

      infoActions.handleGameStatusChange(status)(dispatchSpy);
      expect(dispatchSpy).not.toHaveBeenCalledWith(infoActions.updateGameStatus(status));
      expect(dispatchSpy).toHaveBeenCalledWith(infoActions.updateGameStatus(constants.GAME_STATUS_OUT_OF_SYNC));
    });

    // playing
    it('updates game status to playing if previous status was ready-to-play', () => {
      const status = constants.GAME_STATUS_PLAYING;
      state.info.gameStatus = constants.GAME_STATUS_READY_TO_PLAY;
      state.snakes = { afephrig: true };
      jest.spyOn(store, 'getState').mockImplementation(() => (state));
      const livingSpy = jest.spyOn(infoActions, 'setLivingSnakeCount').mockImplementation(() => {});

      infoActions.handleGameStatusChange(status)(dispatchSpy);
      expect(dispatchSpy).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(infoActions.updateGameStatus(status));

      livingSpy.mockRestore();
    });

    it('does not update game status to playing if previous status was not ready-to-play', () => {
      const status = constants.GAME_STATUS_PLAYING;
      state.info.gameStatus = dummyStatus;
      jest.spyOn(store, 'getState').mockImplementation(() => (state));

      infoActions.handleGameStatusChange(status)(dispatchSpy);
      expect(dispatchSpy).not.toHaveBeenCalledWith(infoActions.updateGameStatus(status));
      expect(dispatchSpy).toHaveBeenCalledWith(infoActions.updateGameStatus(constants.GAME_STATUS_OUT_OF_SYNC));
    });

    // postgame
    it('updates game status to postgame regardles of previous status', () => {
      const status = constants.GAME_STATUS_POSTGAME;
      state.info.gameStatus = dummyStatus;
      jest.spyOn(store, 'getState').mockImplementation(() => (state));
      jest.spyOn(infoActions, 'updateWinner').mockImplementation(() => {});
      jest.spyOn(snakeHelpers, 'getWinners').mockImplementation(() => {});

      infoActions.handleGameStatusChange(status)(dispatchSpy);
      expect(dispatchSpy).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(infoActions.updateGameStatus(status));
    });

    // secondary actions
    it('calls dispatch with headSetActions.updateHeadSets when status is ready-to-play', () => {
      const status = constants.GAME_STATUS_READY_TO_PLAY;
      state.info.gameStatus = constants.GAME_STATUS_PREGAME;
      jest.spyOn(store, 'getState').mockImplementation(() => (state));

      infoActions.handleGameStatusChange(status)(dispatchSpy);
      expect(dispatchSpy).toHaveBeenCalledWith(headSetActions.updateHeadSets());
    });

    it('calls dispatch with setLivingSnakeCount when status is playing', () => {
      const status = constants.GAME_STATUS_PLAYING;
      state.info.gameStatus = constants.GAME_STATUS_READY_TO_PLAY;
      state.snakes = { afephrig: true };
      const keys = Object.keys(state.snakes).length;
      jest.spyOn(store, 'getState').mockImplementation(() => (state));

      const items = [
        [ infoActions.updateGameStatus(status) ],
        [ infoActions.setLivingSnakeCount(keys) ],
      ];

      infoActions.handleGameStatusChange(status)(dispatchSpy);
      expect(dispatchSpy.mock.calls).toEqual(items);
    });

    it('calls dispatch with metaActions.resetGameData (thunk) when status is lobby', () => {
      const status = constants.GAME_STATUS_LOBBY;
      state.info.gameStatus = constants.GAME_STATUS_POSTGAME;
      const spy = jest.spyOn(metaActions, 'resetGameData').mockImplementation(() => {});
      jest.spyOn(store, 'getState').mockImplementation(() => (state));

      infoActions.handleGameStatusChange(status)(dispatchSpy);
      expect(dispatchSpy).toHaveBeenCalledWith(metaActions.resetGameData());
      expect(spy).toHaveBeenCalled();
    });
  });
});
