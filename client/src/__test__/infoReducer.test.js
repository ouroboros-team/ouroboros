import infoReducer, { defaultState } from '../redux/info/infoReducer';
import * as actionTypes from '../redux/actionTypes';

describe('Info reducer', () => {
  let state = {};

  beforeEach(() => {
    state = {
      tu: 70,
      gameStatus: 'playing',
      startingRows: [ 23, 6, 39 ],
      winner: 'Bob',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('INCREMENT_TU increments the TU by one', () => {
    const newState = infoReducer(state, { type: actionTypes.INCREMENT_TU });
    expect(newState.tu).toBe(state.tu + 1);
  });

  it('SET_TU sets the TU to the passed integer', () => {
    const actionObj = {
      tu: 9,
      type: actionTypes.SET_TU,
    };
    const newState = infoReducer(state, actionObj);
    expect(newState.tu).toBe(actionObj.tu);
  });

  it('UPDATE_GAME_STATUS changes the status to the passed string', () => {
    const actionObj = {
      status: 'kwnt',
      type: actionTypes.UPDATE_GAME_STATUS,
    };
    const newState = infoReducer(state, actionObj);
    expect(newState.gameStatus).toBe(actionObj.status);
  });

  it('UPDATE_STARTING_ROWS adds the passed row to the startingRows array', () => {
    const actionObj = {
      row: 43,
      type: actionTypes.UPDATE_STARTING_ROWS,
    };
    const rowsList = [ ...state.startingRows, actionObj.row ];

    const newState = infoReducer(state, actionObj);
    expect(newState.startingRows).toEqual(rowsList);
  });

  it('RESET_STARTING_ROWS sets startingRows to the default state', () => {
    const newState = infoReducer(state, { type: actionTypes.RESET_STARTING_ROWS });
    expect(newState.startingRows).toEqual(defaultState.startingRows);
  });

  it('UPDATE_WINNER sets the passed string as winner', () => {
    const actionObj = {
      winner: 'etdhiv',
      type: actionTypes.UPDATE_WINNER,
    };

    const newState = infoReducer(state, actionObj);
    expect(newState.winner).toEqual(actionObj.winner);
  });

  it('RESET_WINNER sets winner to the default state', () => {
    const newState = infoReducer(state, { type: actionTypes.RESET_WINNER });
    expect(newState.winner).toEqual(defaultState.winner);
  });
});
