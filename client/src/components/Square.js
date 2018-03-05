import React from 'react';
import PropTypes from 'prop-types';

const Square = props => (
  <div className={`square ${props.status} id-${props.snakeId}`} />
);

Square.propTypes = {
  col: PropTypes.number.isRequired,
  row: PropTypes.number.isRequired,
  status: PropTypes.string,
  snakeId: PropTypes.number,
};

Square.defaultProps = {
  status: 'empty',
  snakeId: null,
};

export default Square;
