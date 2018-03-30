import store from '../redux/store';
import * as actionTypes from '../redux/actionTypes';
import * as constants from '../constants';

import * as infoActions from '../redux/info/infoActionCreators';
import * as metaActions from '../redux/metaActionCreators';
import * as p2pActions from '../redux/p2p/p2pActionCreators';
import * as snakeActions from '../redux/snake/snakeActionCreators';

import * as p2pHelpers from '../redux/p2p/p2pHelpers';
import * as snakeHelpers from '../redux/snake/snakeHelpers';
import * as boardHelpers from '../redux/board/boardHelpers';
import * as headSetHelpers from '../redux/headSet/headSetHelpers';

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

    it('calls checkForGameOver', () => {
      const spy = jest.spyOn(snakeHelpers, 'checkForGameOver');

      snakeActions.handleChangeSnakeStatus()(dispatchSpy);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('calls metaActions.declareGameOver if game is over', () => {
      jest.spyOn(snakeHelpers, 'checkForGameOver').mockImplementation(() => (true));
      const spy = jest.spyOn(metaActions, 'declareGameOver');

      snakeActions.handleChangeSnakeStatus()(dispatchSpy);

      expect(spy).toHaveBeenCalledTimes(1);
    });

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
    //   const spy = jest.spyOn(snakeActions, 'handleChangeSnakeStatus').mockImplementation(() => {});
    //
    //   snakeActions.handleUpdateSnakeData(id, data)(dispatchSpy);
    //
    //   expect(spy).toHaveBeenCalled();
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
    let dispatchSpy;

    beforeEach(() => {
      dispatchSpy = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('returns a function', () => {
      expect(typeof snakeActions.initializeOwnSnake()).toBe('function');
    });

    it('calls dispatch with infoActions.randomUniqueRow if no row is passed', () => {
      const id = 'knjerg658';
      jest.spyOn(infoActions, 'randomUniqueRow').mockImplementation(() => {});

      snakeActions.initializeOwnSnake(id)(dispatchSpy);

      expect(dispatchSpy).toHaveBeenCalledWith(infoActions.randomUniqueRow());
    });

    it('does not call dispatch with infoActions.randomUniqueRow if row is passed', () => {
      const id = 'knjerg658';
      const row = 7;
      jest.spyOn(infoActions, 'randomUniqueRow').mockImplementation(() => (row));

      snakeActions.initializeOwnSnake(id, row)(dispatchSpy);

      expect(dispatchSpy).not.toHaveBeenCalledWith(infoActions.randomUniqueRow());
    });

    it('calls snakeHelpers.setStartPosition with passed row', () => {
      const id = 'knjerg658';
      const row = 7;
      const spy = jest.spyOn(snakeHelpers, 'setStartPosition').mockImplementation(() => {});

      snakeActions.initializeOwnSnake(id, row)(dispatchSpy);

      expect(spy).toHaveBeenCalledWith(row);
    });

    it('calls snakeHelpers.emptySnakeObject with positions from snakeHelpers.setStartPosition', () => {
      const id = 'knjerg658';
      const row = 7;
      const positions = { hello: 'world' };
      jest.spyOn(snakeHelpers, 'setStartPosition').mockImplementation(() => (positions));
      const spy = jest.spyOn(snakeHelpers, 'emptySnakeObject');

      snakeActions.initializeOwnSnake(id, row)(dispatchSpy);

      expect(spy).toHaveBeenCalledWith(positions);
    });

    it('calls dispatch with updateSnakeData with generated snake', () => {
      const id = 'knjerg658';
      const row = 7;
      const object = { snake: 'object' };
      jest.spyOn(snakeHelpers, 'setStartPosition').mockImplementation(() => ({}));
      jest.spyOn(snakeHelpers, 'emptySnakeObject').mockImplementation(() => (object));

      snakeActions.initializeOwnSnake(id, row)(dispatchSpy);

      expect(dispatchSpy).toHaveBeenCalledWith(snakeActions.updateSnakeData(id, object));
    });

    it('calls p2pActions.p2pBroadcastSnakeData', () => {
      const id = 'knjerg658';
      const row = 7;
      const spy = jest.spyOn(p2pActions, 'p2pBroadcastSnakeData').mockImplementation(() => {});

      snakeActions.initializeOwnSnake(id, row)(dispatchSpy);

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('writeOwnSnakePosition thunk', () => {
    let dispatchSpy;
    let state;
    const id = 'knjerg658';
    const direction = 'up';
    const positions = { row: 5, column: 3 };

    beforeEach(() => {
      dispatchSpy = jest.fn();

      state = { snakes: {} };
      state.snakes[id] = {};
      state.snakes[id].positions = { byIndex: [ 7 ], byKey: { 7: positions } };
      state.snakes[id].direction = direction;
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('returns a function', () => {
      expect(typeof snakeActions.writeOwnSnakePosition()).toBe('function');
    });

    it('calls snakeHelpers.calculateNextCoords with direction and most recent position of own snake', () => {
      jest.spyOn(store, 'getState').mockImplementation(() => (state));
      const spy = jest.spyOn(snakeHelpers, 'calculateNextCoords').mockImplementation(() => {});

      snakeActions.writeOwnSnakePosition(id)(dispatchSpy);

      expect(spy).toHaveBeenCalledWith(direction, positions);
    });
    it('calls dispatch with updateSnakeData', () => {
      jest.spyOn(store, 'getState').mockImplementation(() => (state));

      snakeActions.writeOwnSnakePosition(id)(dispatchSpy);

      expect(dispatchSpy.mock.calls[0][0].type).toBe(actionTypes.UPDATE_SNAKE_DATA);
    });

    it('calls p2pActions.p2pBroadcastSnakeData', () => {
      jest.spyOn(store, 'getState').mockImplementation(() => (state));
      const spy = jest.spyOn(p2pActions, 'p2pBroadcastSnakeData').mockImplementation(() => {});

      snakeActions.writeOwnSnakePosition(id)(dispatchSpy);

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('checkForCollisions thunk', () => {
    let dispatchSpy;
    let state;
    const id = 'knjerg658';
    const direction = 'up';
    const positions = { row: 5, column: 3 };
    const tu = 7;
    const board = { 803: 'a snake' };

    beforeEach(() => {
      dispatchSpy = jest.fn();

      state = { snakes: {} };
      state.snakes[id] = {};
      state.snakes[id].positions = { byIndex: [ tu ], byKey: {} };
      state.snakes[id].positions.byKey[tu] = positions;
      state.snakes[id].direction = direction;
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('returns a function', () => {
      expect(typeof snakeActions.checkForCollisions()).toBe('function');
    });

    it('calls boardHelpers.aggregateBoards and boardHelpers.aggregateOwnSnake for TUs in range', () => {
      jest.spyOn(store, 'getState').mockImplementation(() => (state));
      jest.spyOn(headSetHelpers, 'coordsToSquareNumber').mockImplementation(() => {});
      const boardSpy = jest.spyOn(boardHelpers, 'aggregateBoards').mockImplementation(() => {});
      const snakeSpy = jest.spyOn(boardHelpers, 'aggregateOwnSnake').mockImplementation(() => {});

      snakeActions.checkForCollisions(id)(dispatchSpy);

      expect(boardSpy).toHaveBeenCalledTimes(constants.NUMBER_CANDIDATE_TUS);
      expect(snakeSpy).toHaveBeenCalledTimes(constants.NUMBER_CANDIDATE_TUS);
    });

    // Problem testing thunks calling thunks
    //
    // it('calls dispatch with handleChangeSnakeStatus to kill own snake if a collision is found', () => {
    //   jest.spyOn(store, 'getState').mockImplementation(() => (state));
    //   jest.spyOn(headSetHelpers, 'coordsToSquareNumber').mockImplementation(() => (803));
    //   jest.spyOn(boardHelpers, 'aggregateBoards').mockImplementation(() => (board));
    //   jest.spyOn(boardHelpers, 'aggregateOwnSnake').mockImplementation(() => {});
    //   jest.spyOn(snakeHelpers, 'snakeIsAlive').mockImplementation(() => (true));
    //   jest.spyOn(snakeHelpers, 'getCollisionType').mockImplementation(() => (true));
    //
    //   const spy = jest.spyOn(snakeActions, 'handleChangeSnakeStatus');
    //   snakeActions.checkForCollisions(id)(dispatchSpy);
    //
    //   expect(spy).toHaveBeenCalledTimes(1);
    // });

    it('calls snakeHelpers.getCollisionType if a collision is found', () => {
      jest.spyOn(store, 'getState').mockImplementation(() => (state));
      jest.spyOn(headSetHelpers, 'coordsToSquareNumber').mockImplementation(() => (803));
      jest.spyOn(boardHelpers, 'aggregateBoards').mockImplementation(() => (board));
      jest.spyOn(boardHelpers, 'aggregateOwnSnake').mockImplementation(() => {});
      jest.spyOn(snakeHelpers, 'snakeIsAlive').mockImplementation(() => (true));
      jest.spyOn(p2pActions, 'p2pBroadcastPatch').mockImplementation(() => {});
      const spy = jest.spyOn(snakeHelpers, 'getCollisionType').mockImplementation(() => (true));

      snakeActions.checkForCollisions(id)(dispatchSpy);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('calls dispatch with p2pActions.p2pKillPeerSnake if a head-on-head collision is found', () => {
      jest.spyOn(store, 'getState').mockImplementation(() => (state));
      jest.spyOn(headSetHelpers, 'coordsToSquareNumber').mockImplementation(() => (803));
      jest.spyOn(boardHelpers, 'aggregateBoards').mockImplementation(() => (board));
      jest.spyOn(snakeHelpers, 'snakeIsAlive').mockImplementation(() => (true));
      jest.spyOn(snakeHelpers, 'getCollisionType').mockImplementation(() => (constants.COLLISION_TYPE_HEAD_ON_HEAD));
      const spy = jest.spyOn(p2pActions, 'p2pKillPeerSnake').mockImplementation(() => {});

      snakeActions.checkForCollisions(id)(dispatchSpy);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('calls p2pActions.p2pBroadcastPatch if a collision is not head-on-head', () => {
      jest.spyOn(store, 'getState').mockImplementation(() => (state));
      jest.spyOn(headSetHelpers, 'coordsToSquareNumber').mockImplementation(() => (803));
      jest.spyOn(boardHelpers, 'aggregateBoards').mockImplementation(() => (board));
      jest.spyOn(snakeHelpers, 'snakeIsAlive').mockImplementation(() => (true));
      jest.spyOn(snakeHelpers, 'getCollisionType').mockImplementation(() => {});
      const spy = jest.spyOn(p2pActions, 'p2pBroadcastPatch').mockImplementation(() => {});

      snakeActions.checkForCollisions(id)(dispatchSpy);

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('checkForLatentSnakes thunk', () => {
    let dispatchSpy;
    let state;
    const tu = 30;

    beforeEach(() => {
      dispatchSpy = jest.fn();
      state = {
        info: { tu },
        snakes: {
          knjlegr: {
            positions: {
              byIndex: [ tu ],
              byKey: {},
            },
          },
          vinadsnv: {
            positions: {
              byIndex: [ tu ],
              byKey: {},
            },
          },
          iugryea: {
            positions: {
              byIndex: [ tu - (constants.LATENT_SNAKE_TOLERANCE + 1) ],
              byKey: {},
            },
          },
        },
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('returns a function', () => {
      expect(typeof snakeActions.checkForLatentSnakes()).toBe('function');
    });

    it('calls snakeHelpers.snakeIsAlive for each snake', () => {
      jest.spyOn(store, 'getState').mockImplementation(() => (state));
      const spy = jest.spyOn(snakeHelpers, 'snakeIsAlive').mockImplementation(() => (true));

      snakeActions.checkForLatentSnakes()(dispatchSpy);

      expect(spy).toHaveBeenCalledTimes(Object.keys(state.snakes).length);
    });

    it('calls dispatch with p2pActions.p2pKillPeerSnake for each snake outside of latency tolerance', () => {
      jest.spyOn(store, 'getState').mockImplementation(() => (state));
      jest.spyOn(snakeHelpers, 'snakeIsAlive').mockImplementation(() => (true));
      const spy = jest.spyOn(p2pActions, 'p2pKillPeerSnake').mockImplementation(() => {});

      const latentCount = Object.keys(state.snakes).reduce((count, id) => {
        if (state.info.tu - state.snakes[id].positions.byIndex[0] > constants.LATENT_SNAKE_TOLERANCE){
          return count + 1;
        }
        return count;
      }, 0);

      snakeActions.checkForLatentSnakes()(dispatchSpy);

      expect(dispatchSpy).toHaveBeenCalledTimes(latentCount);
      expect(spy).toHaveBeenCalledTimes(latentCount);
    });
  });
});
