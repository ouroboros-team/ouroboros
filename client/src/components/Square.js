import React from 'react';
import PropTypes from 'prop-types';

const Square = (props) => {
  const idClass = props.snakeId ? `id-${props.snakeId}` : '';
  return (
    <div
      className={`square ${props.status} ${idClass}`}
      id={`r${props.row}c${props.col}`}
    />
  );
};

Square.propTypes = {
  col: PropTypes.number.isRequired,
  row: PropTypes.number.isRequired,
  status: PropTypes.string,
  snakeId: PropTypes.string,
};

Square.defaultProps = {
  status: 'empty',
  snakeId: null,
};

export default Square;
