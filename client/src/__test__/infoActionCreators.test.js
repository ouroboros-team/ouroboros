import * as actionTypes from '../redux/actionTypes';
import * as infoActions from '../redux/info/infoActionCreators';

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
});
