import React from 'react';
import PropTypes from 'prop-types';

import Square from './Square';
import { connect } from "react-redux";
import { GRID_SIZE } from "../constants";

class GameGrid extends React.Component {
  render() {
    let status = 'empty';
    let snakeId = undefined;
    let theGrid = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        theGrid.push(
          <Square
            col={c}
            key={(r * GRID_SIZE) + c}
            row={r}
            status={(this.props.grid[r] && this.props.grid[r][c]) ? this.props.grid[r][c].status : status}
            snakeId={(this.props.grid[r] && this.props.grid[r][c]) ? this.props.grid[r][c].snakeId : snakeId}
          />
        );
      }
    }

    return (
      <div id='board' className='nine columns'>
        <div id='grid'>
          {theGrid}
        </div>
      </div>
    );
  }
}

GameGrid.propTypes = {
  grid: PropTypes.array,
};

GameGrid.defaultProps = {
  grid: []
};


const mapStateToProps = state => ({
  grid: state.grid,
});

export default connect(mapStateToProps)(GameGrid);
