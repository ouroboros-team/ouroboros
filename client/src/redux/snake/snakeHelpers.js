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

  const gap = Math.abs(newSnake.positions[0].tu - data.positions[0].tu);
  let counter = gap;

  while (counter > 0) {
    // add new coordinates
    newSnake.positions.unshift(data.positions[gap - 1]);

    // purge surplus history
    const keepCount = constants.getHistoryLength(newSnake.positions[0].tu);
    if (newSnake.positions.length > keepCount) {
      newSnake.positions.length = keepCount;
    }

    counter -= 1;
  }
};

export const getSnakeLength = (tu) => (
  constants.INITIAL_SNAKE_LENGTH
);
