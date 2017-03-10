import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { transaction } from 'objection';

import config from '../../config';
import logger from '../../lib/logger';
import User from '../../models/user.model';

const PASSWORD_SALT_ROUNDS = 10;

export const login = (req, res) => {
  const { reqUsername, password } = req.body;
  if (!reqUsername || !password) {
    return res.status(400).send({
      error: 'username and password required'
    });
  }

  return User
    .query()
    .where({
      username: reqUsername
    })
    .then(async (users) => {
      const user = users.length > 0 ? users[0] : null;
      if (user) {
        const { id, username } = user;
        const passwordMatches = await bcrypt.compare(password, user.password);

        if (passwordMatches) {
          const token = jwt.sign({
            subject: id
          }, config.auth.secret);
          return res
            .cookie('test_app_token', token)
            .send({
              data: {
                username,
                token
              }
            });
        }
      }
      return res.sendStatus(401);
    })
    .catch((err) => {
      logger.error(err);
      return res.status(500).send({ error: err });
    });
};

export const register = async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
  return transaction(User, (user) => {
    return user
      .query()
      .insert({ username, password: hashedPassword });
  })
  .then((createdUser) => {
    logger.info('user created %s', createdUser.username);
    res.sendStatus(200);
  })
  .catch((err) => {
    if (err.detail) {
      logger.error(err.detail);
    }
    return res.status(400).send({ error: 'error inserting user' });
  });
};
