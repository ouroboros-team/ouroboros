import store from './store';
import { GRID_SIZE } from "../constants";

export function gameOverCheck(){
  const snakes = store.getState().data.snakes;
  const aliveSnakes = snakes.filter((snake) =>(snake.status === 'alive'));
  return aliveSnakes.length === 1; // only one snake remains
}

export function collisionCheck(){
  const snakes = store.getState().data.snakes;
  let result = [];
  let coordinates = [];
  snakes.forEach((snake) => {
    snake.position.forEach((coords, index) => {

      if(coordinates[coords.row] === undefined) {
        coordinates[coords.row] = [];
      }

      if(coordinates[coords.row][coords.column] === undefined){
        coordinates[coords.row][coords.column] = {snakeId: snake.id, head: index === 0}
      } else {
        // collision

        if(coordinates[coords.row][coords.column].head){
          // coordinates[coords.row][coords.column].snakeId is dead
          result.push(coordinates[coords.row][coords.column].snakeId);
        }

        if(index === 0){
          // snake.id is dead
          result.push(snake.id);
        }
      }
    });
  });

  return result;
}

export function getSnakeAndIndexById(snakes, id){
  let result = undefined;
  let index = undefined;

  snakes.forEach((snake, i) => {
      if (snake.id === id) {
        index = i;
      }
    }
  );

  if(index !== undefined){
    result = snakes[index]
  }
  return [result, index];
}

export function validate_direction(oldDirection, newDirection){
  switch (newDirection){
    case 'up':
    case 'down':
      return oldDirection !== 'up' && oldDirection !== 'down';
    case 'left':
    case 'right':
      return oldDirection !== 'left' && oldDirection !== 'right';
    default:
      return oldDirection;
  }
}

export function change_direction(snake, newDirection){
  if(!validate_direction(snake.direction, newDirection)){
    return snake;
  }

  const newSnake = { ...snake };
  newSnake.direction = newDirection;
  return newSnake;
}

export function dead_reckon_next_coordinates(snake){
  if(snake.status === 'dead'){
    return snake;
  }

  const newSnake = {...snake};
  newSnake.position = [...newSnake.position];
  const nextCoordinates = {...newSnake.position[0]};

  switch (newSnake.direction) {
    case 'right':
      nextCoordinates.column += 1;
      nextCoordinates.column %= GRID_SIZE;
      break;
    case 'left': // towards 0
      nextCoordinates.column -= 1;
      if(nextCoordinates.column < 0){
        nextCoordinates.column += GRID_SIZE;
      }
      break;
    case 'up': // towards 0
      nextCoordinates.row -= 1;
      if(nextCoordinates.row < 0){
        nextCoordinates.row += GRID_SIZE;
      }
      break;
    case 'down':
    default:
      nextCoordinates.row += 1;
      nextCoordinates.row %= GRID_SIZE;
      break;
  }

  // add new coordinates, remove oldest coordinates
  newSnake.position.unshift(nextCoordinates);
  newSnake.position.pop();

  return newSnake;
}
