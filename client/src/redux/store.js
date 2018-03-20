import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import ReduxThunk from 'redux-thunk';

import headSetReducer from './headSet/headSetReducer';
import displayReducer from './display/displayReducer';
import infoReducer from './info/infoReducer';
import p2pReducer from './p2p/p2pReducer';
import snakesReducer from './snake/snakeReducer';

const reducer = combineReducers({
  headSets: headSetReducer,
  displayBoard: displayReducer,
  info: infoReducer,
  p2p: p2pReducer,
  snakes: snakesReducer,
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
