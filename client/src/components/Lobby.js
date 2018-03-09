import React from 'react';
import { connect } from 'react-redux';

const Lobby = props => (
  <div>
    <h1>Welcome</h1>
    <a href={`${window.location.origin}/${props.ownPeerId}`}>
      {`${window.location.origin}/${props.ownPeerId}`}
    </a>
  </div>
);

const mapStateToProps = state => ({
  ownPeerId: state.p2p.id,
});

export default connect(mapStateToProps)(Lobby);
