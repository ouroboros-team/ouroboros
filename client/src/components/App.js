import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import * as actionCreators from '../redux/actionCreators';
import '../assets/styles/index.scss';

import Header from './Header';
import Game from './Game';
// TODO: routes for informational screens

const App = props => (
  <div>
    <Header />
    <Route
      path='/:peerId'
      render={({ match }) => {
        // save peerId to redux store
        console.log(match.params.peerId);
        props.p2pGetPeerIdFromURL(match.params.peerId);
        return (
          <Game />
        );
      }}
    />
  </div>
);

const mapDispatchToProps = dispatch => ({
  p2pGetPeerIdFromURL: (id) => {
    dispatch(actionCreators.p2pGetPeerIdFromURL(id));
  },
});

export default connect(null, mapDispatchToProps)(App);
