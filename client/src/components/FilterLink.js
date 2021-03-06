import React from 'react';
import { NavLink } from 'react-router-dom';

const FilterLink = ({ filter, children, ...other }) => (
  <NavLink {...other} to={filter === 'home' ? '/' : `/${filter}`}>
    {children}
  </NavLink>
);

export default FilterLink;
