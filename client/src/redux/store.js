import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import ReduxThunk from 'redux-thunk';

import p2pReducer from './p2p/p2pReducer';
import infoReducer from './info/infoReducer';
import snakesReducer from './snake/snakeReducer';
import boardReducer from './board/boardReducer';
import displayReducer from './display/displayReducer';

const reducer = combineReducers({
  p2p: p2pReducer,
  info: infoReducer,
  snakes: snakesReducer,
  boards: boardReducer,
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
