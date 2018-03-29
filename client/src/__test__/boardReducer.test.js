import boardReducer from '../redux/board/boardReducer';
import * as boardHelpers from '../redux/board/boardHelpers';
import * as actionTypes from '../redux/actionTypes';

describe('Board reducer', () => {
  const state = { hello: 'world' };

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('GET_INITIAL_BOARD returns boardHelpers.getInitialBoard()', () => {
    const val = 'some random return';
    const spy = jest.spyOn(boardHelpers, 'getInitialBoard').mockImplementation(() => (val));

    const newState = boardReducer(state, { type: actionTypes.GET_INITIAL_BOARD });
    expect(spy).toHaveBeenCalled();
    expect(newState).toBe(val);
  });

  it('GET_NEXT_BOARD returns boardHelpers.buildNextBoard()', () => {
    const val = 'some other return';
    const spy = jest.spyOn(boardHelpers, 'buildNextBoard').mockImplementation(() => (val));

    const newState = boardReducer(state, { type: actionTypes.GET_NEXT_BOARD });
    expect(spy).toHaveBeenCalled();
    expect(newState).toBe(val);
  });

  it('RESET_BOARD sets state to empty object', () => {
    const newState = boardReducer(state, { type: actionTypes.RESET_BOARD });
    expect(newState).toEqual({});
  });
});
