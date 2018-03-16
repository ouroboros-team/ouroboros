import React from 'react';
import { shallow } from 'enzyme';

import PlayerList from '../components/PlayerList';

describe('PlayerList component', () => {
  beforeEach(() => {
  });

  it('shallow renders', () => {
    shallow(<PlayerList />);
  });

  it('renders an li for the header when there are no peers', () => {
    const wrapper = shallow(<PlayerList />);

    expect(wrapper.find('li').length).toEqual(1);
  });

  it('renders one li for each player in peers, plus one for the header', () => {
    const peers = {
      asdf: { styleId: 0, username: 'Bob' },
      hijk: { styleId: 1, username: 'Mary' },
    };
    const wrapper = shallow(<PlayerList peers={peers} />);

    expect(wrapper.find('li').length).toEqual(3);
  });

  it('renders one li.id# for each peer, where # is the peer\'s styleId', () => {
    const peers = {
      asdf: { styleId: 0, username: 'Bob' },
    };
    const wrapper = shallow(<PlayerList peers={peers} />);

    expect(wrapper.find(`li.id-${peers.asdf.styleId}`).length).toEqual(1);
  });

  it('renders username', () => {
    const peers = {
      asdf: { styleId: 0, username: 'Bob' },
    };
    const wrapper = shallow(<PlayerList peers={peers} />);

    expect(wrapper.find('li.id-0').text()).toBe(peers.asdf.username);
  });

  it('renders defaultUsername', () => {
    const peers = {
      asdf: { styleId: 0, defaultUsername: 'Bob' },
    };
    const wrapper = shallow(<PlayerList peers={peers} />);

    expect(wrapper.find('li.id-0').text()).toBe(peers.asdf.defaultUsername);
  });

  it('renders username, even when defaultUsername is present', () => {
    const peers = {
      asdf: {
        styleId: 0,
        defaultUsername: 'Player 0',
        username: 'Bob',
      },
    };
    const wrapper = shallow(<PlayerList peers={peers} />);

    expect(wrapper.find('li.id-0').text()).toBe(peers.asdf.username);
  });
});
