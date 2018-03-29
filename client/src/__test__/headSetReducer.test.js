import headSetReducer, { defaultState } from '../redux/headSet/headSetReducer';
import * as actionTypes from '../redux/actionTypes';
import * as headSetHelpers from '../redux/headSet/headSetHelpers';

describe('Head set reducer', () => {
  let state = {};

  beforeEach(() => {
    state = {
      newest: 45,
      oldest: 30,
      byKey: {
        1: {},
        2: { a: 'stuff' },
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('UPDATE_HEAD_SETS calls updateAllHeadSets when no id is passed', () => {
    const actionObj = {
      type: actionTypes.UPDATE_HEAD_SETS,
    };
    const spy = jest.spyOn(headSetHelpers, 'updateAllHeadSets').mockImplementation(() => {});
    headSetReducer(state, actionObj);

    expect(spy).toHaveBeenCalled();
  });

  it('UPDATE_HEAD_SETS calls updateSnakeHeadSets when id is passed', () => {
    const actionObj = {
      id: 'laierjbf346',
      type: actionTypes.UPDATE_HEAD_SETS,
    };
    const spy = jest.spyOn(headSetHelpers, 'updateSnakeHeadSets').mockImplementation(() => {});
    headSetReducer(state, actionObj);

    expect(spy).toHaveBeenCalled();
  });

  it('PATCH_HEAD_SET calls patchHeadSetMutate', () => {
    const spy = jest.spyOn(headSetHelpers, 'patchHeadSetMutate').mockImplementation(() => {});
    headSetReducer(state, { type: actionTypes.PATCH_HEAD_SET });

    expect(spy).toHaveBeenCalled();
  });

  it('RESET_HEAD_SETS sets state to default object', () => {
    const newState = headSetReducer(state, { type: actionTypes.RESET_HEAD_SETS });
    expect(newState).toEqual(defaultState);
  });
});
