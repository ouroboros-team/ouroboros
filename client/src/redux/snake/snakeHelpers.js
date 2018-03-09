import * as constants from '../../constants';

export const validateDirectionChange = (oldDir, newDir) => {
  switch (oldDir) {
    case 'down':
    case 'up':
      if (newDir === 'left' || newDir === 'right') {
        return true;
      }
      break;
    case 'left':
    case 'right':
    default:
      if (newDir === 'up' || newDir === 'down') {
        return true;
      }
  }

  return false;
};


// data is assumed to be in the same format as snakes in the Redux store
export const updateSnakeDataMutate = (newSnake, data) => {
  newSnake.direction = data.direction;

  const gap = Math.abs(newSnake.body[0].tu - data.body[0].tu);
  let counter = gap;

  while (counter > 0) {
    // add new coordinates
    newSnake.body.unshift(data.body[gap - 1]);

    // move tail to history
    newSnake.history.unshift(newSnake.body.pop());

    // purge history
    if (newSnake.history.length > constants.HISTORY_LENGTH) {
      newSnake.history.length = constants.HISTORY_LENGTH;
    }

    counter -= 1;
  }
};

export const getSnakeLength = (tu) => (
  constants.INITIAL_SNAKE_LENGTH
);
