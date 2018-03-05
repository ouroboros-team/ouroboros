import React from 'react';

import logo from '../assets/images/logo.png';

const Header = () => (
  <header>
    <img
      alt=''
      className='logo'
      src={logo}
    />
    <h1>Ouroboros</h1>
  </header>
);

export default Header;
