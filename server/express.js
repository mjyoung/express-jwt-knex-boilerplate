import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
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
import { extractTokenFromCookieOrAuthHeader } from './lib/auth.lib';


const API_ROOT = path.join(__dirname, 'api');

// hook objection.js up with knex
Model.knex(knex);

// --------------------------
// Auth
// --------------------------

const JwtStrategy = passportJWT.Strategy;

const jwtOptions = {
  jwtFromRequest: extractTokenFromCookieOrAuthHeader,
  secretOrKey: config.auth.secret
};

const strategy = new JwtStrategy(jwtOptions, (jwtPayload, done) => {
  const user = {
    id: jwtPayload.subject
  };
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
const corsOptions = {
  origin: true,
  credentials: true
};
app.use(cors(corsOptions));

// use express' body parser to access body elements later
app.use(bodyParser.json());

// gzip all the things
app.use(compression());

app.use(cookieParser());

// --------------------------
// API
// --------------------------

// For all routes, if a user exists from the token, pass the info through req.user.
/* eslint-disable no-param-reassign, no-unused-vars */
app.all('*', (req, res, next) => {
  passport.authenticate('jwt', { session: false },
    (err, user, info) => {
      if (err) {
        logger.error(err);
      }
      if (user) {
        req.user = user;
      }
      return next();
    })(req, res, next);
});
/* eslint-enable */

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
    error: `route not found: ${req.url}`
  });
});

module.exports = app;
