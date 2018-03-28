import * as actionTypes from '../redux/actionTypes';
import * as snakeActions from '../redux/snake/snakeActionCreators';

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
});
