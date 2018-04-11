import store from '../redux/store';
import * as actionTypes from '../redux/actionTypes';
import * as headSetActions from '../redux/headSet/headSetActionCreators';
import * as infoActions from '../redux/info/infoActionCreators';
import * as metaActions from '../redux/metaActionCreators';
import * as p2pActions from '../redux/p2p/p2pActionCreators';
import * as constants from '../constants';

describe('Info action creators', () => {
  it('incrementTu returns expected object', () => {
    const obj = infoActions.incrementTu();
    expect(obj).toEqual({ type: actionTypes.INCREMENT_TU });
  });

  it('setTu returns expected object', () => {
    const tu = 23;
    const obj = infoActions.setTu(tu);
    expect(obj).toEqual({
      tu,
      type: actionTypes.SET_TU,
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
      const row = infoActions.getAvailableRow()(dispatchSpy);
      const result = row >= 0 && row < constants.GRID_SIZE;
      expect(result).toBe(true);
    });

    it('generates a row that is in info.availableRows', () => {
      const row = infoActions.getAvailableRow()(dispatchSpy);
      expect(initialState.info.availableRows.includes(row)).toBe(true);
    });
  });

  describe('handleGameStatusChange thunk', () => {
    const dispatchSpy = jest.fn();

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('returns a function', () => {
      expect(typeof infoActions.handleGameStatusChange()).toBe('function');
    });

    it('calls dispatch with updateGameStatus with passed status as an argument', () => {
      const status = 'lkadjn';

      infoActions.handleGameStatusChange(status)(dispatchSpy);
      expect(dispatchSpy).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(infoActions.updateGameStatus(status));
    });

    it('calls dispatch with headSetActions.updateHeadSets when status is ready-to-play', () => {
      const status = constants.GAME_STATUS_READY_TO_PLAY;

      infoActions.handleGameStatusChange(status)(dispatchSpy);
      expect(dispatchSpy).toHaveBeenCalledWith(headSetActions.updateHeadSets());
    });

    it('calls dispatch with setLivingSnakeCount when status is playing', () => {
      const status = constants.GAME_STATUS_PLAYING;
      const state = {
        snakes: {
          1: true,
          2: true,
        },
      };
      const keys = Object.keys(state.snakes).length;
      jest.spyOn(store, 'getState').mockImplementation(() => (state));

      infoActions.handleGameStatusChange(status)(dispatchSpy);
      expect(dispatchSpy).toHaveBeenCalledWith(infoActions.setLivingSnakeCount(keys));
    });

    it('calls dispatch with metaActions.resetGameData (thunk) when status is lobby', () => {
      const status = constants.GAME_STATUS_LOBBY;
      const spy = jest.spyOn(metaActions, 'resetGameData').mockImplementation(() => {
      });

      infoActions.handleGameStatusChange(status)(dispatchSpy);
      expect(dispatchSpy).toHaveBeenCalledWith(metaActions.resetGameData());
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('fastForwardTu thunk', () => {
    let initialState;
    const id = 'alkenrfg874';
    const dispatchSpy = jest.fn();

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('returns a function', () => {
      expect(typeof infoActions.fastForwardTu()).toBe('function');
    });

    it('calls dispatch with setTu with newTu to fast-forward TU when peer TUs are ahead significantly', () => {
      initialState = {
        info: { tu: 5 },
        snakes: {
          ebjkrh: {
            positions: { newest: 20 },
          },
          lakjn: {
            positions: { newest: 21 },
          },
        },
      };

      const getStateSpy = jest.spyOn(store, 'getState').mockImplementation(() => (initialState));

      const newTu = infoActions.fastForwardTu(id)(dispatchSpy);
      expect(getStateSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(infoActions.setTu(newTu));
    });

    it('takes no action when peer TUs are close', () => {
      initialState = {
        info: { tu: 5 },
        snakes: {
          ebjkrh: {
            positions: { newest: 6 },
          },
          lakjn: {
            positions: { newest: 4 },
          },
        },
      };

      const getStateSpy = jest.spyOn(store, 'getState').mockImplementation(() => (initialState));

      const newTu = infoActions.fastForwardTu(id)(dispatchSpy);
      expect(getStateSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).not.toHaveBeenCalledWith(infoActions.setTu(newTu));
      expect(newTu).toBe(initialState.info.tu);
    });

    it('checks another peer\'s TU if first peer checked is self', () => {
      initialState = {
        info: { tu: 5 },
        snakes: {
          alkenrfg874: {
            positions: { newest: 5 },
          },
          lakjn: {
            positions: { newest: 21 },
          },
        },
      };

      const getStateSpy = jest.spyOn(store, 'getState').mockImplementation(() => (initialState));

      const newTu = infoActions.fastForwardTu(id)(dispatchSpy);
      expect(getStateSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(infoActions.setTu(newTu));
    });

  });
});
