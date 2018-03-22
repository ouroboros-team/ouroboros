import React from 'react';
import { NavLink } from 'react-router-dom';

const FilterLink = ({ filter, children }) => (
  <NavLink to={filter === 'home' ? '/' : `/${filter}`}>
    {children}
  </NavLink>
);

export default FilterLink;
