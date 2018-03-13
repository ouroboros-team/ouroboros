const express = require('express');
const app = express();
const peer = require('peer');
const path = require('path');

const port = process.env.PORT || 3001;

app.set('port', port);

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

const server = app.listen(app.get('port'));

app.use('/peerjs', peer.ExpressPeerServer(server, {
  debug: true,
}));
