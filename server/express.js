import _ from 'lodash';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import glob from 'glob';
import { Model } from 'objection';
import passport from 'passport';
import passportJWT from 'passport-jwt';
import path from 'path';

import config from './config';
import knex from '../db/knex';
import logger from './lib/logger';

const API_ROOT = path.join(__dirname, 'api');

// hook objection.js up with knex
Model.knex(knex);

// --------------------------
// Auth
// --------------------------

const users = [
  {
    id: 1,
    username: 'test',
    password: 'test'
  }
];

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  secretOrKey: config.auth.secret
};

const strategy = new JwtStrategy(jwtOptions, (jwtPayload, done) => {
  logger.debug('payload received', jwtPayload);
  const user = users[_.findIndex(users, { id: jwtPayload.id })];
  if (user) {
    return done(null, user);
  }
  return done(null, false);
});

passport.use(strategy);

// --------------------------
// Express app
// --------------------------

// Create the express application
const app = express();

// Enable all CORS requests
app.use(cors());

// use express' body parser to access body elements later
app.use(bodyParser.json());

// gzip all the things
app.use(compression());

// --------------------------
// API
// --------------------------

app.all('/v1/secure', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({ message: 'Success! You can not see this without a token' });
  }
);

// load the server controllers (via the routes)
const ROUTE_PATH = path.join(API_ROOT, 'routes');
const router = new express.Router();
glob(`${ROUTE_PATH}/**/*.js`, (err, files) => {
  files.map(file => require(file)(router));
});
app.use(router);

// if at this point we don't have a route match for /api, return 404
app.all('*', (req, res) => {
  res.status(404).send({
    error: `route not found: ${req.url}`,
  });
});

module.exports = app;
