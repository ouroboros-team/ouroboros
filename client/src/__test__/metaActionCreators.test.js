import * as actionTypes from '../redux/actionTypes';
import * as constants from '../constants';

import * as metaActions from '../redux/metaActionCreators';

import * as boardActions from '../redux/board/boardActionCreators';
import * as headSetActions from '../redux/headSet/headSetActionCreators';
import * as infoActions from '../redux/info/infoActionCreators';
import * as p2pActions from '../redux/p2p/p2pActionCreators';
import * as snakeActions from '../redux/snake/snakeActionCreators';

import * as snakeHelpers from '../redux/snake/snakeHelpers';

describe('Meta action creators', () => {
  describe('handleTuTick thunk', () => {
    const dispatchSpy = jest.fn();
    const id = 'egnkndv54678';

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('returns a function', () => {
      expect(typeof metaActions.handleTuTick(id)).toBe('function');
    });

    it('calls snakeHelpers.snakeIsAlive', () => {
      const spy = jest.spyOn(snakeHelpers, 'snakeIsAlive').mockImplementation(() => (true));

      metaActions.handleTuTick(id)(dispatchSpy);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('calls snakeActions.writeOwnSnakePosition and snakeActions.checkForCollisions if snake is alive', () => {
      jest.spyOn(snakeHelpers, 'snakeIsAlive').mockImplementation(() => (true));
      const writeSpy = jest.spyOn(snakeActions, 'writeOwnSnakePosition');
      const collisionsSpy = jest.spyOn(snakeActions, 'checkForCollisions');

      metaActions.handleTuTick(id)(dispatchSpy);

      expect(writeSpy).toHaveBeenCalledTimes(1);
      expect(collisionsSpy).toHaveBeenCalledTimes(1);
    });

    it('calls infoActions.fastForwardTu if snake is dead', () => {
      jest.spyOn(snakeHelpers, 'snakeIsAlive').mockImplementation(() => (false));
      const spy = jest.spyOn(infoActions, 'fastForwardTu');

      metaActions.handleTuTick(id)(dispatchSpy);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('calls snakeActions.checkForLatentSnakes', () => {
      jest.spyOn(snakeHelpers, 'snakeIsAlive').mockImplementation(() => (false));
      const spy = jest.spyOn(snakeActions, 'checkForLatentSnakes');

      metaActions.handleTuTick(id)(dispatchSpy);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('calls infoActions.incrementTu', () => {
      jest.spyOn(snakeHelpers, 'snakeIsAlive').mockImplementation(() => (false));
      const spy = jest.spyOn(infoActions, 'incrementTu');

      metaActions.handleTuTick(id)(dispatchSpy);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('calls boardActions.getNextBoard', () => {
      jest.spyOn(snakeHelpers, 'snakeIsAlive').mockImplementation(() => (false));
      const spy = jest.spyOn(boardActions, 'getNextBoard');

      metaActions.handleTuTick(id)(dispatchSpy);

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
  describe('receiveSnakeData thunk', () => {
    const dispatchSpy = jest.fn();

    const id = 'egnkndv54678';
    const data = {
      direction: 'right',
      previousDirection: 'up',
      status: 'alive',
      positions: {
        byIndex: [ 1, 0 ],
        byKey: {
          1: { row: 4, column: 7 },
          0: { row: 4, column: 8 },
        },
      },
    };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('returns a function', () => {
      expect(typeof metaActions.receiveSnakeData()).toBe('function');
    });

    it('calls snakeHelpers.getTuGap with passed id and data', () => {
      const spy = jest.spyOn(snakeHelpers, 'getTuGap').mockImplementation(() => {});

      metaActions.receiveSnakeData(id, data)(dispatchSpy);

      expect(spy).toHaveBeenCalledWith(id, data);
    });

    it('calls dispatch with snakeActions.handleUpdateSnakeData with passed id and data', () => {
      jest.spyOn(snakeHelpers, 'getTuGap').mockImplementation(() => (5));
      const updateSpy = jest.spyOn(snakeActions, 'handleUpdateSnakeData').mockImplementation(() => {});

      metaActions.receiveSnakeData(id, data)(dispatchSpy);
      expect(dispatchSpy).toHaveBeenCalledWith(snakeActions.handleUpdateSnakeData(id, data));
      expect(updateSpy).toHaveBeenCalledWith(id, data);
    });

    it('calls dispatch with headSetActions.updateHeadSets with passed id and gap', () => {
      const gap = 5;
      jest.spyOn(snakeHelpers, 'getTuGap').mockImplementation(() => (gap));
      const spy = jest.spyOn(headSetActions, 'updateHeadSets').mockImplementation(() => {});

      metaActions.receiveSnakeData(id, data)(dispatchSpy);
      expect(dispatchSpy).toHaveBeenCalledWith(headSetActions.updateHeadSets(id, null, gap));
      expect(spy).toHaveBeenCalledWith(id, null, gap);
    });
  });
  describe('checkReadiness thunk', () => {

  });
  describe('resetGameData thunk', () => {

  });
  describe('declareWinner thunk', () => {

  });
  describe('confirmWinner thunk', () => {

  });
  describe('declareGameOver thunk', () => {

  });
});
