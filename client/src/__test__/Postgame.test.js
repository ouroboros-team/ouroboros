import React from 'react';
import { shallow } from 'enzyme';
import Postgame from '../components/Postgame';

describe('Postgame', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Postgame />);
  });

  it('shallow renders', () => {
    expect(wrapper.length).toEqual(1);
  });

  it('renders a play again button', () => {
    expect(wrapper.find('input[type="button"]').length).toEqual(1);
  });
});
