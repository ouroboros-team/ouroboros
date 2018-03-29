import store from '../redux/store';
import * as actionTypes from '../redux/actionTypes';
import * as infoActions from '../redux/info/infoActionCreators';
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

    it('returns a function', () => {
      expect(typeof infoActions.randomUniqueRow()).toBe('function');
    });

    it('calls dispatch with updateStartingRows with generated row as an argument', () => {
      const dispatchSpy = jest.fn();
      const getStateSpy = jest.spyOn(store, 'getState').mockImplementation(() => (initialState));

      const row = infoActions.randomUniqueRow()(dispatchSpy);
      expect(getStateSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(infoActions.updateStartingRows(row));
    });

    it('generates a row that is <= 0 and > GRID_SIZE', () => {
      const dispatchSpy = jest.fn();

      const row = infoActions.randomUniqueRow()(dispatchSpy);
      const result = row >= 0 && row < constants.GRID_SIZE;
      expect(result).toBe(true);
    });

    it('generates a row that is not already in info.startingRows', () => {
      const dispatchSpy = jest.fn();

      const row = infoActions.randomUniqueRow()(dispatchSpy);
      expect(initialState.info.startingRows.includes(row)).toBe(false);
    });

  });
});
