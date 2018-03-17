import React from 'react';
import { shallow } from 'enzyme';
import Lobby from '../components/Lobby';

describe('Lobby', () => {
  it('shallow renders', () => {
    shallow(<Lobby />);
  });

  it('should render an form for entering a user name', () => {
    const wrapper = shallow(<Lobby />);
    expect(wrapper.find('form').length).toEqual(1);
    expect(wrapper.find('input[type="text"]').length).toEqual(1);
    expect(wrapper.find('input[type="submit"]').length).toEqual(1);
  });
});
