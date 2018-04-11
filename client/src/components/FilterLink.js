import React from 'react';
import { NavLink } from 'react-router-dom';

const FilterLink = ({ filter, children, className }) => (
  <NavLink to={filter === 'home' ? '/' : `/${filter}`} className={className}>
    {children}
  </NavLink>
);

export default FilterLink;
