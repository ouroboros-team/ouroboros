import store from '../redux/store';
import * as actionTypes from '../redux/actionTypes';
import * as constants from '../constants';

import * as infoActions from '../redux/info/infoActionCreators';
import * as p2pActions from '../redux/p2p/p2pActionCreators';
import * as snakeActions from '../redux/snake/snakeActionCreators';

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

  it('setTuOfDeath returns expected object', () => {
    const id = 'ekjrbf98475';
    const tuOfDeath = 8;

    const obj = snakeActions.setTuOfDeath(id, tuOfDeath);
    expect(obj).toEqual({
      id,
      tuOfDeath,
      type: actionTypes.SET_TU_OF_DEATH,
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
      const mockDir = jest.spyOn(snakeActions, 'changeSnakeDirection').mockImplementation(() => {});
      const mockBroadcast = jest.spyOn(p2pActions, 'p2pBroadcastSnakeData').mockImplementation(() => {});

      snakeActions.handleChangeSnakeDirection(id, direction)(dispatchSpy);
      expect(spy).toHaveBeenCalledWith(id);

      spy.mockRestore();
      mockDir.mockRestore();
      mockBroadcast.mockRestore();
    });

    it('calls dispatch with changeSnakeDirection if snake is alive', () => {
      const id = 'sbihou38457';
      const direction = 'lejrb';
      const aliveSpy = jest.spyOn(snakeHelpers, 'snakeIsAlive').mockImplementation(() => (true));
      const broadcastSpy = jest.spyOn(p2pActions, 'p2pBroadcastSnakeData').mockImplementation(() => {});

      snakeActions.handleChangeSnakeDirection(id, direction)(dispatchSpy);
      expect(dispatchSpy).toHaveBeenCalledWith(snakeActions.changeSnakeDirection(id, direction));

      aliveSpy.mockRestore();
      broadcastSpy.mockRestore();
    });

    it('calls p2pActions.p2pBroadcastSnakeData if snake is alive', () => {
      const id = 'sbihou38457';
      const direction = 'lejrb';
      const aliveSpy = jest.spyOn(snakeHelpers, 'snakeIsAlive').mockImplementation(() => (true));
      const broadcastSpy = jest.spyOn(p2pActions, 'p2pBroadcastSnakeData').mockImplementation(() => {});

      snakeActions.handleChangeSnakeDirection(id, direction)(dispatchSpy);
      expect(broadcastSpy).toHaveBeenCalledTimes(1);

      aliveSpy.mockRestore();
      broadcastSpy.mockRestore();
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

    it('calls dispatch with infoActions.getAvailableRow if ownStartingRow is null', () => {
      const id = 'knjerg658';
      const state = { info: { ownStartingRow: null } };
      jest.spyOn(store, 'getState').mockImplementation(() => (state));
      const broadcastSpy = jest.spyOn(p2pActions, 'p2pBroadcastSnakeData').mockImplementation(() => {});
      const rowSpy = jest.spyOn(infoActions, 'getAvailableRow').mockImplementation(() => {});

      snakeActions.initializeOwnSnake(id)(dispatchSpy);

      expect(dispatchSpy).toHaveBeenCalledWith(infoActions.getAvailableRow());

      broadcastSpy.mockRestore();
      rowSpy.mockRestore();
    });

    it('does not call dispatch with infoActions.getAvailableRow if ownStartingRow is defined', () => {
      const id = 'knjerg658';
      const row = 7;
      const state = { info: { ownStartingRow: row } };
      jest.spyOn(store, 'getState').mockImplementation(() => (state));
      const broadcastSpy = jest.spyOn(p2pActions, 'p2pBroadcastSnakeData').mockImplementation(() => {});
      const rowSpy = jest.spyOn(infoActions, 'getAvailableRow').mockImplementation((row) => {});

      snakeActions.initializeOwnSnake(id)(dispatchSpy);

      expect(dispatchSpy).not.toHaveBeenCalledWith(infoActions.getAvailableRow());

      broadcastSpy.mockRestore();
      rowSpy.mockRestore();
    });

    it('calls snakeHelpers.setStartPosition with ownStartingRow', () => {
      const id = 'knjerg658';
      const row = 7;
      const state = { info: { ownStartingRow: row } };
      jest.spyOn(store, 'getState').mockImplementation(() => (state));
      const broadcastSpy = jest.spyOn(p2pActions, 'p2pBroadcastSnakeData').mockImplementation(() => {});
      const spy = jest.spyOn(snakeHelpers, 'setStartPosition').mockImplementation(() => {});

      snakeActions.initializeOwnSnake(id)(dispatchSpy);

      expect(spy).toHaveBeenCalledWith(row);

      spy.mockRestore();
      broadcastSpy.mockRestore();
    });

    it('calls snakeHelpers.emptySnakeObject with positions from snakeHelpers.setStartPosition', () => {
      const id = 'knjerg658';
      const row = 7;
      const state = { info: { ownStartingRow: row } };
      jest.spyOn(store, 'getState').mockImplementation(() => (state));
      const positions = { hello: 'world' };
      const startSpy = jest.spyOn(snakeHelpers, 'setStartPosition').mockImplementation(() => (positions));
      const broadcastSpy = jest.spyOn(p2pActions, 'p2pBroadcastSnakeData').mockImplementation(() => {});
      const spy = jest.spyOn(snakeHelpers, 'emptySnakeObject');

      snakeActions.initializeOwnSnake(id)(dispatchSpy);

      expect(spy).toHaveBeenCalledWith(positions);

      startSpy.mockRestore();
      broadcastSpy.mockRestore();
      spy.mockRestore();
    });

    it('calls dispatch with updateSnakeData with generated snake', () => {
      const id = 'knjerg658';
      const row = 7;
      const state = { info: { ownStartingRow: row } };
      jest.spyOn(store, 'getState').mockImplementation(() => (state));
      const object = { snake: 'object' };
      const broadcastSpy = jest.spyOn(p2pActions, 'p2pBroadcastSnakeData').mockImplementation(() => {});
      const startSpy = jest.spyOn(snakeHelpers, 'setStartPosition').mockImplementation(() => ({}));
      const emptySpy = jest.spyOn(snakeHelpers, 'emptySnakeObject').mockImplementation(() => (object));

      snakeActions.initializeOwnSnake(id)(dispatchSpy);

      expect(dispatchSpy).toHaveBeenCalledWith(snakeActions.updateSnakeData(id, object));

      broadcastSpy.mockRestore();
      startSpy.mockRestore();
      emptySpy.mockRestore();
    });

    it('calls p2pActions.p2pBroadcastSnakeData', () => {
      const id = 'knjerg658';
      const row = 7;
      const state = { info: { ownStartingRow: row } };
      jest.spyOn(store, 'getState').mockImplementation(() => (state));
      const spy = jest.spyOn(p2pActions, 'p2pBroadcastSnakeData').mockImplementation(() => {});

      snakeActions.initializeOwnSnake(id, row)(dispatchSpy);

      expect(spy).toHaveBeenCalledTimes(1);

      spy.mockRestore();
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
      state.snakes[id].positions = { newest: 7, oldest: 7, byKey: { 7: positions } };
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
      const broadcastSpy = jest.spyOn(p2pActions, 'p2pBroadcastSnakeData').mockImplementation(() => {});

      snakeActions.writeOwnSnakePosition(id)(dispatchSpy);

      expect(spy).toHaveBeenCalledWith(direction, positions);

      spy.mockRestore();
      broadcastSpy.mockRestore();
    });
    it('calls dispatch with updateSnakeData', () => {
      jest.spyOn(store, 'getState').mockImplementation(() => (state));
      const broadcastSpy = jest.spyOn(p2pActions, 'p2pBroadcastSnakeData').mockImplementation(() => {});

      snakeActions.writeOwnSnakePosition(id)(dispatchSpy);

      expect(dispatchSpy.mock.calls[0][0].type).toBe(actionTypes.UPDATE_SNAKE_DATA);

      broadcastSpy.mockRestore();
    });

    it('calls p2pActions.p2pBroadcastSnakeData', () => {
      jest.spyOn(store, 'getState').mockImplementation(() => (state));
      const spy = jest.spyOn(p2pActions, 'p2pBroadcastSnakeData').mockImplementation(() => {});

      snakeActions.writeOwnSnakePosition(id)(dispatchSpy);

      expect(spy).toHaveBeenCalledTimes(1);

      spy.mockRestore();
    });
  });

  describe('checkForCollisions thunk', () => {
    let dispatchSpy;
    let state;
    const id = 'knjerg658';
    const direction = 'up';
    const positions = { row: 5, column: 3 };
    const tu = 7;

    beforeEach(() => {
      dispatchSpy = jest.fn();

      state = { snakes: {} };
      state.snakes[id] = {};
      state.snakes[id].positions = { newest: tu, oldest: tu, byKey: {} };
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

    it('calls boardHelpers.aggregateBoard and boardHelpers.aggregateOwnSnake for TUs in range', () => {
      jest.spyOn(store, 'getState').mockImplementation(() => (state));
      jest.spyOn(headSetHelpers, 'coordsToSquareNumber').mockImplementation(() => {});
      const boardSpy = jest.spyOn(boardHelpers, 'aggregateBoard').mockImplementation(() => {});
      const snakeSpy = jest.spyOn(boardHelpers, 'aggregateOwnSnake').mockImplementation(() => {});

      snakeActions.checkForCollisions(id)(dispatchSpy);

      expect(boardSpy).toHaveBeenCalledTimes(constants.NUMBER_CANDIDATE_TUS);
      expect(snakeSpy).toHaveBeenCalledTimes(constants.NUMBER_CANDIDATE_TUS);
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
              oldest: tu,
              newest: tu,
              byKey: {},
            },
          },
          vinadsnv: {
            positions: {
              oldest: tu,
              newest: tu,
              byKey: {},
            },
          },
          iugryea: {
            positions: {
              oldest: tu,
              newest: tu,
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
        if (state.info.tu - state.snakes[id].positions.newest > constants.LATENT_SNAKE_TOLERANCE){
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
