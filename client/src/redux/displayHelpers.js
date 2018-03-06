import store from './store';

export const getNextDisplayBoard = () => {
  // this function simply copies the canonical board with no other processing
  // todo: calculate next position according to snake directions,
  // remove snake tails,
  // and add new head positions to the returned object

  const board = store.getState().board;
  return { ...board };
};
