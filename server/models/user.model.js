import BaseModel from './_base.model';

class User extends BaseModel {
  static get tableName() {
    return 'users';
  }
}

export default User;
