import React from 'react';
import { shallow } from 'enzyme';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import GameBoard from '../components/GameBoard';

const initialState = { board: {} };
const mockStore = configureStore([ thunk ]);
const store = mockStore(initialState);

describe('GameBoard component', () => {
  beforeEach(() => {
  });

  it('shallow renders', () => {
    shallow(<GameBoard store={store} />);
  });
});
