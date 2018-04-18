import React from 'react';
import { shallow } from 'enzyme';
import Pregame from '../components/Pregame';

describe('Pregame', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Pregame />);
  });

  it('shallow renders', () => {
    expect(wrapper.length).toEqual(1);
  });

  it('renders wait div', () => {
    expect(wrapper.find('div.wait').length).toEqual(1);
  });
});
