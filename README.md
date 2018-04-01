# Ouroboros

[![Build Status](https://travis-ci.org/ouroboros-team/ouroboros.svg?branch=master)](https://travis-ci.org/ouroboros-team/ouroboros)

This is a peer-to-peer snake game that was created to experiment with fast-paced,
real-time, direct peer-to-peer data exchange over the WebRTC data channel.

Under the hood, this is a `create-react-app` with a Node server to broker
peer-to-peer connections.

## Running locally

```
git clone https://github.com/ouroboros-team/ouroboros.git
cd ouroboros
yarn install

cd client
yarn install

cd ..
yarn start
```

## Deploying

The app is ready to be deployed to Heroku.  In fact, new code merged to the
`master` branch that passes our tests is automatically deployed via
[TravisCI](https://travis-ci.org/).
