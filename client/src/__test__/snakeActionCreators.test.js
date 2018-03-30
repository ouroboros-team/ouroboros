import * as actionTypes from '../redux/actionTypes';
import * as constants from '../constants';

import * as snakeActions from '../redux/snake/snakeActionCreators';
import * as p2pActions from '../redux/p2p/p2pActionCreators';

import * as p2pHelpers from '../redux/p2p/p2pHelpers';
import * as snakeHelpers from '../redux/snake/snakeHelpers';
import * as metaActions from '../redux/metaActionCreators';

describe('Snake action creators', () => {
  it('changeSnakeDirection returns expected object', () => {
    const id = 'dfihuv0923';
    const direction = 'oeiru';

    const obj = snakeActions.changeSnakeDirection(id, direction);
    expect(obj).toEqual({
      id,
      direction,
      type: actionTypes.CHANGE_SNAKE_DIRECTION,
    });
  });

  it('changeSnakeStatus returns expected object', () => {
    const id = 'ekjrbf98475';
    const status = 'kwjqnj';

    const obj = snakeActions.changeSnakeStatus(id, status);
    expect(obj).toEqual({
      id,
      status,
      type: actionTypes.CHANGE_SNAKE_STATUS,
    });
  });

  it('updateSnakeData returns expected object', () => {
    const id = 'ekjrbf98475';
    const data = {};

    const obj = snakeActions.updateSnakeData(id, data);
    expect(obj).toEqual({
      id,
      data,
      type: actionTypes.UPDATE_SNAKE_DATA,
    });
  });

  it('resetSnakeData returns expected object', () => {
    const obj = snakeActions.resetSnakeData();
    expect(obj).toEqual({ type: actionTypes.RESET_SNAKE_DATA });
  });

  describe('handleChangeSnakeStatus thunk', () => {
    let dispatchSpy;

    beforeEach(() => {
      dispatchSpy = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('returns a function', () => {
      expect(typeof snakeActions.handleChangeSnakeStatus()).toBe('function');
    });

    it('calls dispatch with changeSnakeStatus with passed id and status', () => {
      const id = 'sbihou38457';
      const data = {};

      snakeActions.handleChangeSnakeStatus(id, data)(dispatchSpy);
      expect(dispatchSpy.mock.calls[0]).toEqual([
        snakeActions.changeSnakeStatus(id, data),
      ]);
    });

    // Problems testing thunks calling thunks
    //
    // it('calls dispatch with checkForGameOver', () => {
    //   const id = 'sbihou38457';
    //   const data = {};
    //
    //   snakeActions.handleChangeSnakeStatus(id, data)(dispatchSpy);
    //   expect(dispatchSpy.mock.calls[1]).toEqual([
    //     snakeActions.checkForGameOver()
    //   ]);
    // });

    it('calls p2pActions.p2pBroadcastSnakeData if passed id is own id', () => {
      const id = 'sbihou38457';
      jest.spyOn(p2pHelpers, 'getOwnId').mockImplementation(() => (id));
      const spy = jest.spyOn(p2pActions, 'p2pBroadcastSnakeData').mockImplementation(() => {});

      snakeActions.handleChangeSnakeStatus(id, {})(dispatchSpy);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleChangeSnakeDirection thunk', () => {
    let dispatchSpy;

    beforeEach(() => {
      dispatchSpy = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('returns a function', () => {
      expect(typeof snakeActions.handleChangeSnakeDirection()).toBe('function');
    });

    it('calls snakeHelpers.snakeIsAlive with passed id', () => {
      const id = 'sbihou38457';
      const direction = 'lejrb';
      const spy = jest.spyOn(snakeHelpers, 'snakeIsAlive').mockImplementation(() => (true));
      snakeActions.handleChangeSnakeDirection(id, direction)(dispatchSpy);
      expect(spy).toHaveBeenCalledWith(id);
    });

    it('calls dispatch with changeSnakeDirection if snake is alive', () => {
      const id = 'sbihou38457';
      const direction = 'lejrb';
      jest.spyOn(snakeHelpers, 'snakeIsAlive').mockImplementation(() => (true));

      snakeActions.handleChangeSnakeDirection(id, direction)(dispatchSpy);
      expect(dispatchSpy).toHaveBeenCalledWith(snakeActions.changeSnakeDirection(id, direction));
    });

    it('calls p2pActions.p2pBroadcastSnakeData if snake is alive', () => {
      const id = 'sbihou38457';
      const direction = 'lejrb';
      jest.spyOn(snakeHelpers, 'snakeIsAlive').mockImplementation(() => (true));
      const broadcastSpy = jest.spyOn(p2pActions, 'p2pBroadcastSnakeData').mockImplementation(() => {});

      snakeActions.handleChangeSnakeDirection(id, direction)(dispatchSpy);
      expect(broadcastSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleUpdateSnakeData thunk', () => {
    let dispatchSpy;

    beforeEach(() => {
      dispatchSpy = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('returns a function', () => {
      expect(typeof snakeActions.handleUpdateSnakeData()).toBe('function');
    });

    // Problems testing thunks calling thunks
    //
    // it('calls handleChangeSnakeStatus if passed snake data shows status of dead', () => {
    //   const id = 'sbihou38457';
    //   const data = { status: constants.SNAKE_STATUS_DEAD };
    //
    //   snakeActions.handleUpdateSnakeData(id, data)(dispatchSpy);
    //   expect(dispatchSpy.mock.calls[0]).toEqual([
    //     snakeActions.handleChangeSnakeStatus()
    //   ]);
    // });

    it('calls updateSnakeData with passed id and data', () => {
      const id = 'sbihou38457';
      const data = {};

      snakeActions.handleUpdateSnakeData(id, data)(dispatchSpy);
      expect(dispatchSpy.mock.calls[0]).toEqual([
        snakeActions.updateSnakeData(id, data),
      ]);
    });
  });

  describe('initializeOwnSnake thunk', () => {
  });

  describe('writeOwnSnakePosition thunk', () => {
  });

  describe('checkForCollisions thunk', () => {
  });

  describe('checkForGameOver thunk', () => {
  });

  describe('checkForLatentSnakes thunk', () => {
  });
});
