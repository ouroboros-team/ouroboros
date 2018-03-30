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

  it('renders a button', () => {
    expect(wrapper.find('input[type="button"]').length).toEqual(1);
  });
});
