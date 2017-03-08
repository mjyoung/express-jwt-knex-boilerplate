/*
  https://github.com/Vincit/objection.js/issues/88

  Allow us to do stuff like:

  Instead of actually deleting the record, just add a deleted_at timestamp:

  Person
    .query()
    .softDelete()
    .where('foo', '<', 42)

  To get the records including those with deleted_at not null:

  Person
    .query()
    .where('foo', '<', 42)
    .withArchived(true)
*/
const QueryBuilder = require('objection').QueryBuilder;

class CustomQueryBuilder extends QueryBuilder {
  constructor(modelClass) {
    super(modelClass);

    this.onBuild((builder) => {
      if (!builder.context().withArchived) {
        builder.whereNull('deleted_at');
      }
    });
  }

  withArchived(withArchived) {
    this.context().withArchived = withArchived;
    return this;
  }

  softDelete() {
    return this.patch({ deleted_at: new Date().toISOString() });
  }
}

module.exports = CustomQueryBuilder;
