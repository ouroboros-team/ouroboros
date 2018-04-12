import React from 'react';
import FilterLink from './FilterLink';

import logo from '../assets/images/logo.svg';

const Header = () => (
  <header>
    <div className='container'>
      <div className='five columns'>
        <div id='logo-text'>
          <FilterLink filter='home'>
            <h1>
              <img
                alt='O'
                className='logo'
                src={logo}
            />uroboros</h1>
          </FilterLink>
        </div>
      </div>
      <nav className='label seven columns'>
        <FilterLink filter='home'>Home</FilterLink>
        <FilterLink filter='play'>Play</FilterLink>
        <FilterLink filter='how-to-play'>How to Play</FilterLink>
        <FilterLink filter='troubleshooting'>Troubleshooting</FilterLink>
      </nav>
    </div>
  </header>
);

export default Header;
