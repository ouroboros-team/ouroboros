import React from 'react';
import PropTypes from 'prop-types';

const Square = (props) => {
  const idClass = props.styleId ? `id-${props.styleId}` : '';
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
  styleId: PropTypes.number,
};

Square.defaultProps = {
  status: 'empty',
  styleId: null,
};

export default Square;
