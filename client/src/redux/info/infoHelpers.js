import shuffle from 'lodash/shuffle';

import * as constants from '../../constants';

export const getShuffledAvailableRows = () => (
  shuffle([ ...Array(constants.GRID_SIZE).keys() ])
);
