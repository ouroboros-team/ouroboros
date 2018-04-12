import React from 'react';
import FilterLink from './FilterLink';

import logo from '../assets/images/logo.svg';

const Header = () => (
  <header>
    <div className='container'>
      <div className='six columns'>
        <h1>
          <img
            alt='O'
            className='logo'
            src={logo}
          />uroboros</h1>
      </div>
      <nav className='label six columns'>
        <FilterLink filter='home'>Home</FilterLink>
        <FilterLink filter='troubleshooting'>Troubleshooting</FilterLink>
      </nav>
    </div>
  </header>
);

export default Header;
