import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import * as p2pActions from '../redux/p2p/p2pActionCreators';
import '../assets/styles/index.scss';

import Header from './Header';
import Game from './Game';

// TODO: routes for informational screens

class App extends React.Component {
  componentDidMount() {
    this.props.p2pInitialize();
  }

  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route
            path='/:peerId?'
            render={({ match }) => {
              // save peerId to redux store
              if (match.params.peerId) {
                this.props.p2pGetPeerIdFromURL(match.params.peerId);
              }
              return (
                <Game />
              );
            }}
          />
        </Switch>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  p2pGetPeerIdFromURL: (id) => {
    dispatch(p2pActions.p2pGetPeerIdFromURL(id));
  },
  p2pInitialize: () => {
    dispatch(p2pActions.p2pInitialize());
  },
});

export default connect(null, mapDispatchToProps)(App);
