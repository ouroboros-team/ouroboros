const express = require('express');
const app = express();
const peer = require('peer');

const port = process.env.PORT || 3001;

app.set('port', port);

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

const server = app.listen(app.get('port'));

app.use('/peerjs', peer.ExpressPeerServer(server, {
  debug: true,
}));
