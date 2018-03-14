import React from 'react';
import { shallow } from 'enzyme';
import Header from '../components/Header';

describe('Header', () => {
  it('shallow renders', () => {
    shallow(<Header />);
  });

  it('should render an h1 and an img.logo', () => {
    const wrapper = shallow(<Header />);
    expect(wrapper.find('img.logo').length).toEqual(1);
    expect(wrapper.find('h1').length).toEqual(1);
  });
});
