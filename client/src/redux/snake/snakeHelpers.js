import * as constants from '../../constants';

export const getSnakeLength = (tu) => (
  constants.INITIAL_SNAKE_LENGTH
);

export const emptySnakeObject = () => ({
  direction: 'left',
  status: 'alive',
  positions: [],
});

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
    const keepCount = getSnakeLength(newSnake.positions[0].tu) + constants.HISTORY_LENGTH;
    if (newSnake.positions.length > keepCount) {
      newSnake.positions.length = keepCount;
    }

    counter -= 1;
  }
};
