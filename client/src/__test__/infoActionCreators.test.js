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

  it('updateStartingRows returns expected object', () => {
    const row = 38;
    const obj = infoActions.updateStartingRows(row);
    expect(obj).toEqual({
      row,
      type: actionTypes.UPDATE_STARTING_ROWS,
    });
  });

  it('resetStartingRows returns expected object', () => {
    const obj = infoActions.resetStartingRows();
    expect(obj).toEqual({ type: actionTypes.RESET_STARTING_ROWS });
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

  describe('randomUniqueRow thunk', () => {
    const dispatchSpy = jest.fn();
    let initialState = {};

    beforeEach(() => {
      initialState = {
        info: {
          startingRows: [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
            11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
            21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
            31, 32, 33, 34, 35, 36, 37, 38,
          ],
        },
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('returns a function', () => {
      expect(typeof infoActions.randomUniqueRow()).toBe('function');
    });

    it('calls dispatch with updateStartingRows with generated row as an argument', () => {
      const getStateSpy = jest.spyOn(store, 'getState').mockImplementation(() => (initialState));

      const row = infoActions.randomUniqueRow()(dispatchSpy);
      expect(getStateSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(infoActions.updateStartingRows(row));
    });

    it('generates a row that is <= 0 and > GRID_SIZE', () => {
      const row = infoActions.randomUniqueRow()(dispatchSpy);
      const result = row >= 0 && row < constants.GRID_SIZE;
      expect(result).toBe(true);
    });

    it('generates a row that is not already in info.startingRows', () => {
      const row = infoActions.randomUniqueRow()(dispatchSpy);
      expect(initialState.info.startingRows.includes(row)).toBe(false);
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

    it('calls p2pActions.p2pBroadcastSnakeData when status is playing', () => {
      const status = constants.GAME_STATUS_PLAYING;
      const spy = jest.spyOn(p2pActions, 'p2pBroadcastSnakeData').mockImplementation(() => {
      });

      infoActions.handleGameStatusChange(status)(dispatchSpy);
      expect(spy).toHaveBeenCalled();
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
            positions: { byIndex: [ 20 ] },
          },
          lakjn: {
            positions: { byIndex: [ 21 ] },
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
            positions: { byIndex: [ 6 ] },
          },
          lakjn: {
            positions: { byIndex: [ 4 ] },
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
            positions: { byIndex: [ 5 ] },
          },
          lakjn: {
            positions: { byIndex: [ 21 ] },
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
