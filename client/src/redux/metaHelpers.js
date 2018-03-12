import random from 'lodash/random';
import * as constants from '../constants';

export const deepClone = obj => (
  JSON.parse(JSON.stringify(obj))
);

const rowsUsed = [];

export const randomUniqueRow = () => {
  let row = random(0, constants.GRID_SIZE - 1);
  while (rowsUsed.includes(row)) {
    row = random(0, constants.GRID_SIZE - 1);
  }

  rowsUsed.push(row);
  return row;
};
