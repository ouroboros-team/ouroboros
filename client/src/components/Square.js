import React from 'react';
import PropTypes from 'prop-types';

const Square = props => (
  <div
    className={`square ${props.status} id-${props.styleId}`}
    id={props.number}
  />
);

Square.propTypes = {
  number: PropTypes.number.isRequired,
  status: PropTypes.string,
  styleId: PropTypes.number,
};

Square.defaultProps = {
  status: 'empty',
  styleId: null,
};

export default Square;
