import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import ReduxThunk from 'redux-thunk';

import infoReducer from './infoReducer';
import snakesReducer from './snakeReducer';
import boardReducer from './boardReducer';
import displayReducer from './displayReducer';

const reducer = combineReducers({
  info: infoReducer,
  snakes: snakesReducer,
  board: boardReducer,
  displayBoard: displayReducer,
});

const logger = createLogger({
  collapsed: true,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(ReduxThunk, logger)),
);

export default store;
