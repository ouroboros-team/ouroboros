import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import ReduxThunk from 'redux-thunk';

import gridReducer from './gridReducer';
import snakesReducer from './snakesReducer';

const reducer = combineReducers({
  grid: gridReducer,
  data: snakesReducer,
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
