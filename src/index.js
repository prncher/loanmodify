const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const crypto = require('crypto');
const config = require('./config.json');
const defaultroutes = require('./routes');
const firebase = require("firebase/app");
require("firebase/auth");
require('@google-cloud/debug-agent').start({serviceContext: {enableCanary: true}});


firebase.initializeApp(config.firebaseConfig)
defaultroutes.setFirebase(firebase);

const app = express();

app.use(bodyParser.json());

/* ----- session ----- */
app.use(cookieSession({
  name: 'session',
  keys: [crypto.randomBytes(32).toString('hex')],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
app.use(cookieParser())

/* ----- serve static ----- */
app.use(express.static(path.join(__dirname, 'ui/build')));
app.use('/', defaultroutes)

const port = config.port || 3000;
app.listen(port);
console.log(`Started app on port ${port}`);

module.exports = app;