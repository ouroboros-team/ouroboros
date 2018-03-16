import React from 'react';
import { shallow } from 'enzyme';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import Game from '../components/Game';
import Lobby from '../components/Lobby';
import Loop from '../components/Loop';
import Pregame from '../components/Pregame';
import Postgame from '../components/Postgame';

import * as constants from '../constants';


describe('Game component', () => {
  let initialState = {};
  const mockStore = configureStore([ thunk ]);
  let store;

  beforeEach(() => {
    initialState = {
      p2p: {
        id: undefined,
        peers: undefined,
      },
      info: {
        gameStatus: undefined,
      },
    };
  });

  it('shallow renders', () => {
    store = mockStore(initialState);
    shallow(<Game store={store} />);
  });

  it('receives the correct props from the Redux store', () => {
    const id = 'asdf';
    const peers = { hello: 'world' };
    const status = 'fdsa';

    initialState.p2p.id = id;
    initialState.p2p.peers = peers;
    initialState.info.gameStatus = status;

    store = mockStore(initialState);
    const wrapper = shallow(<Game store={store} />);

    expect(wrapper.props().ownPeerId).toBe(id);
    expect(wrapper.props().status).toBe(status);
    expect(wrapper.props().peers).toBe(peers);
  });

  it('renders Lobby when status is lobby', () => {
    initialState.info.gameStatus = constants.GAME_STATUS_LOBBY;
    store = mockStore(initialState);
    const wrapper = shallow(<Game store={store} />).dive();

    expect(wrapper.find(Lobby).length).toBe(1);
  });

  it('renders Pregame when status is pregame', () => {
    initialState.info.gameStatus = constants.GAME_STATUS_PREGAME;
    store = mockStore(initialState);
    const wrapper = shallow(<Game store={store} />).dive();

    expect(wrapper.find(Pregame).length).toBe(1);
  });

  it('renders Pregame when status is ready to play', () => {
    initialState.info.gameStatus = constants.GAME_STATUS_READY_TO_PLAY;
    store = mockStore(initialState);
    const wrapper = shallow(<Game store={store} />).dive();

    expect(wrapper.find(Pregame).length).toBe(1);
  });

  it('renders Loop when status is playing', () => {
    initialState.info.gameStatus = constants.GAME_STATUS_PLAYING;
    store = mockStore(initialState);
    const wrapper = shallow(<Game store={store} />).dive();

    expect(wrapper.find(Loop).length).toBe(1);
  });

  it('renders Postgame when status is postgame', () => {
    initialState.info.gameStatus = constants.GAME_STATUS_POSTGAME;
    store = mockStore(initialState);
    const wrapper = shallow(<Game store={store} />).dive();

    expect(wrapper.find(Postgame).length).toBe(1);
  });
});
