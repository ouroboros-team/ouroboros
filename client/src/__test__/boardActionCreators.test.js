import * as actionTypes from '../redux/actionTypes';
import * as boardActions from '../redux/board/boardActionCreators';

describe('Board action creators', () => {
  it('getInitialBoard returns expected object', () => {
    const obj = boardActions.getInitialBoard();
    expect(obj).toEqual({ type: actionTypes.GET_INITIAL_BOARD });
  });

  it('getNextBoard returns expected object', () => {
    const obj = boardActions.getNextBoard();
    expect(obj).toEqual({ type: actionTypes.GET_NEXT_BOARD });
  });

  it('resetBoard returns expected object', () => {
    const obj = boardActions.resetBoard();
    expect(obj).toEqual({ type: actionTypes.RESET_BOARD });
  });
});
