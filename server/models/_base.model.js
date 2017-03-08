import { Model } from 'objection';
import CustomQueryBuilder from './_custom-query-builder';

class BaseModel extends Model {
  $beforeInsert() {
    this.created_at = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }

  static get QueryBuilder() {
    return CustomQueryBuilder;
  }
  static get RelatedQueryBuilder() {
    return CustomQueryBuilder;
  }
  // static QueryBuilder = CustomQueryBuilder;
  // static RelatedQueryBuilder = CustomQueryBuilder;
}

export default BaseModel;
