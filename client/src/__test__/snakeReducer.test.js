import snakeReducer from '../redux/snake/snakeReducer';
import * as actionTypes from '../redux/actionTypes';
import store from '../redux/store';
import * as snakeHelpers from '../redux/snake/snakeHelpers';
import * as p2pHelpers from '../redux/p2p/p2pHelpers';

describe('Snake reducer', () => {
  const id = 'begrdhiuv3267';
  let state = {};

  beforeEach(() => {
    state = {
      begrdhiuv3267: {
        direction: 'right',
        previousDirection: 'up',
        status: 'alive',
        positions: {
          newest: 1,
          oldest: 0,
          byKey: {
            1: { row: 4, column: 7 },
            0: { row: 4, column: 8 },
          },
        },
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });


  it('CHANGE_SNAKE_DIRECTION sets direction for passed id when passed direction is valid', () => {
    const actionObj = {
      id,
      direction: 'left',
      type: actionTypes.CHANGE_SNAKE_DIRECTION,
    };

    const spy = jest.spyOn(snakeHelpers, 'validateDirectionChange').mockImplementation(() => (true));

    const newState = snakeReducer(state, actionObj);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(newState[actionObj.id].direction).toBe(actionObj.direction);
  });

  it('CHANGE_SNAKE_DIRECTION does not set direction for passed id when passed direction is invalid', () => {
    const actionObj = {
      id,
      direction: 'down',
      type: actionTypes.CHANGE_SNAKE_DIRECTION,
    };

    const spy = jest.spyOn(snakeHelpers, 'validateDirectionChange').mockImplementation(() => (false));

    const newState = snakeReducer(state, actionObj);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(newState[actionObj.id].direction).toBe(state[actionObj.id].direction);
  });

  it('CHANGE_SNAKE_DIRECTION validates passed direction against previousDirection when present', () => {
    const actionObj = {
      id,
      direction: 'down',
      type: actionTypes.CHANGE_SNAKE_DIRECTION,
    };

    const spy = jest.spyOn(snakeHelpers, 'validateDirectionChange').mockImplementation(() => (false));

    snakeReducer(state, actionObj);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(state[actionObj.id].previousDirection, actionObj.direction);
  });

  it('CHANGE_SNAKE_STATUS changes status of an existing snake', () => {
    const actionObj = {
      id,
      status: 'dead',
      type: actionTypes.CHANGE_SNAKE_STATUS,
    };

    const newState = snakeReducer(state, actionObj);
    expect(newState[id].status).toBe(actionObj.status);
  });

  it('CHANGE_SNAKE_STATUS does nothing if the new status is the same as the old status', () => {
    const actionObj = {
      id,
      status: 'alive',
      type: actionTypes.CHANGE_SNAKE_STATUS,
    };

    const newState = snakeReducer(state, actionObj);
    expect(newState).toBe(state);
  });

  it('CHANGE_SNAKE_STATUS does nothing if the passed id is nonexistent', () => {
    const actionObj = {
      id: 'not an id',
      status: 'alive',
      type: actionTypes.CHANGE_SNAKE_STATUS,
    };

    const newState = snakeReducer(state, actionObj);
    expect(newState).toBe(state);
  });

  it('UPDATE_SNAKE_DATA adds all received data if no previous data is held', () => {
    const data = {
      direction: 'left',
      previousDirection: 'up',
      status: 'alive',
      styleId: 0,
      positions: {
        newest: 4,
        oldest: 0,
        byKey: {
          4: { row: 5, column: 5 },
          3: { row: 5, column: 6 },
          2: { row: 4, column: 6 },
          1: { row: 4, column: 7 },
          0: { row: 4, column: 8 },
        },
      },
    };

    const actionObj = {
      id: 'a new id',
      data,
      type: actionTypes.UPDATE_SNAKE_DATA,
    };

    const newState = snakeReducer(state, actionObj);
    expect(newState[actionObj.id]).toBe(data);
  });

  it('UPDATE_SNAKE_DATA adds received data to existing snake when newer than existing data', () => {
    const data = {
      direction: 'left',
      previousDirection: 'up',
      status: 'alive',
      styleId: 0,
      positions: {
        newest: 4,
        oldest: 2,
        byKey: {
          4: { row: 5, column: 5 },
          3: { row: 5, column: 6 },
          2: { row: 4, column: 6 },
        },
      },
    };

    const actionObj = {
      id,
      data,
      type: actionTypes.UPDATE_SNAKE_DATA,
    };

    const newState = snakeReducer(state, actionObj);

    const mergedByKey = { ...actionObj.data.positions.byKey, ...state[actionObj.id].positions.byKey };

    expect(newState[actionObj.id].positions.newest).toEqual(data.positions.newest);
    expect(newState[actionObj.id].positions.byKey).toEqual(mergedByKey);
  });

  it('UPDATE_SNAKE_DATA updates previousDirection if passed id is for local snake', () => {
    const data = {
      direction: 'left',
      previousDirection: 'up',
      status: 'alive',
      styleId: 0,
      positions: {
        newest: 4,
        oldest: 2,
        byKey: {
          4: { row: 5, column: 5 },
          3: { row: 5, column: 6 },
          2: { row: 4, column: 6 },
        },
      },
    };

    const actionObj = {
      id,
      data,
      type: actionTypes.UPDATE_SNAKE_DATA,
    };

    const spy = jest.spyOn(p2pHelpers, 'getOwnId').mockImplementation(() => (id));

    const newState = snakeReducer(state, actionObj);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(newState[actionObj.id].previousDirection).toEqual(actionObj.data.direction);
  });

  it('UPDATE_SNAKE_DATA calls snakeHelpers.updateSnakeDataMutate with old data and passed data', () => {
    const data = {
      direction: 'left',
      previousDirection: 'up',
      status: 'alive',
      styleId: 0,
      positions: {
        newest: 4,
        oldest: 2,
        byKey: {
          4: { row: 5, column: 5 },
          3: { row: 5, column: 6 },
          2: { row: 4, column: 6 },
        },
      },
    };

    const actionObj = {
      id,
      data,
      type: actionTypes.UPDATE_SNAKE_DATA,
    };

    const spy = jest.spyOn(snakeHelpers, 'updateSnakeDataMutate').mockImplementation(() => {});

    snakeReducer(state, actionObj);

    expect(spy).toHaveBeenCalledWith(state[actionObj.id], actionObj.data);
  });

  it('UPDATE_SNAKE_DATA does nothing if data is not newer than existing snake data', () => {
    const data = {
      direction: 'left',
      previousDirection: 'up',
      status: 'alive',
      styleId: 0,
      positions: {
        newest: 1,
        oldest: 0,
        byKey: {
          1: { row: 4, column: 7 },
          0: { row: 4, column: 8 },
        },
      },
    };

    const actionObj = {
      id,
      data,
      type: actionTypes.UPDATE_SNAKE_DATA,
    };

    const newState = snakeReducer(state, actionObj);
    expect(newState).toEqual(state);
  });

  it('RESET_SNAKE_DATA sets state to empty object', () => {
    const newState = snakeReducer(state, { type: actionTypes.RESET_SNAKE_DATA });
    expect(newState).toEqual({});
  });
});
