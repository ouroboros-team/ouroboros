import * as actionTypes from '../redux/actionTypes';
import * as headSetActions from '../redux/headSet/headSetActionCreators';

describe('Head set action creators', () => {
  it('updateHeadSets returns expected object', () => {
    const id = 'aeirgjfn5678';
    const gap = 7;

    const obj = headSetActions.updateHeadSets(id, gap);
    expect(obj).toEqual({
      id,
      gap,
      type: actionTypes.UPDATE_HEAD_SETS,
    });
  });

  it('patchHeadSet returns expected object', () => {
    const tu = 67;
    const sqNum = 234;
    const id = 'cvoibu678';

    const obj = headSetActions.patchHeadSet(tu, sqNum, id);
    expect(obj).toEqual({
      tu,
      sqNum,
      id,
      type: actionTypes.PATCH_HEAD_SET,
    });
  });

  it('resetHeadSets returns expected object', () => {
    const obj = headSetActions.resetHeadSets();
    expect(obj).toEqual({ type: actionTypes.RESET_HEAD_SETS });
  });
});
