import { Model } from 'objection';
import knexConfig from '../../db/knex';
import User from '../../server/models/user.model';

Model.knex(knexConfig);

exports.seed = async (knex, Promise) => {
  // Deletes ALL existing entries
  return Promise.all([
    await User.query().delete()
  ]).then(async () => {
    await User
      .query()
      .insert({
        id: 1,
        username: 'test@test.com',
        password: '$2a$10$r3/9825c6vvTr9we4iHqn.u819CySda39BE9wwUo08cR8hGPlZ6aG' // 'test'
      });
  });
};
