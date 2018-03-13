import React from 'react';
import { shallow, mount } from 'enzyme';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import MockRouter from 'react-mock-router';

import App from '../App';

const initialState = {};
const mockStore = configureStore([ thunk ]);
const store = mockStore(initialState);

describe('App component', () => {
  beforeEach(() => {
  });

  it('shallow renders', () => {
    shallow(<App store={store} />);
  });

  it('mounts with router', () => {
    mount(
      <MockRouter>
        <App store={store} />
      </MockRouter>,
    );
  });
});
