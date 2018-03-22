import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './redux/store';
import './assets/styles/index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Route path='/:filter?' component={App} />
    </Router>
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
