import { Model } from 'objection';

class User extends Model {
  static get tableName() {
    return 'users';
  }
}

export default User;
