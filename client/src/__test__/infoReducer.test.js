import infoReducer, { defaultState } from '../redux/info/infoReducer';
import * as actionTypes from '../redux/actionTypes';
import * as constants from '../constants';

describe('Info reducer', () => {
  let state = {};

  beforeEach(() => {
    state = {
      tu: 70,
      gameStatus: 'playing',
      availableRows: [ 23, 6, 39 ],
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

  it('RESET_TU sets the TU to 0', () => {
    const actionObj = {
      type: actionTypes.RESET_TU,
    };
    const newState = infoReducer(state, actionObj);
    expect(newState.tu).toBe(0);
  });

  it('UPDATE_GAME_STATUS changes the status to the passed string', () => {
    const actionObj = {
      status: 'kwnt',
      type: actionTypes.UPDATE_GAME_STATUS,
    };
    const newState = infoReducer(state, actionObj);
    expect(newState.gameStatus).toBe(actionObj.status);
  });

  it('UPDATE_AVAILABLE_ROWS sets availableRows to the passed array', () => {
    const actionObj = {
      availableRows: [ 23, 6 ],
      type: actionTypes.UPDATE_AVAILABLE_ROWS,
    };

    const newState = infoReducer(state, actionObj);
    expect(newState.availableRows).toEqual(actionObj.availableRows);
  });

  it('RESET_AVAILABLE_ROWS sets availableRows to the default state', () => {
    const newState = infoReducer(state, { type: actionTypes.RESET_AVAILABLE_ROWS });
    expect(newState.availableRows.length).toEqual(constants.GRID_SIZE);
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
