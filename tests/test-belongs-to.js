var User = require('./user').User;
var Collection = require('./collection').Collection;

Collection.belongsTo('users',Collection.fields["user_id"], User);

exports.testBelongsTo = function(test) {
  test.expect(1);
  test.equals(Collection.findOne(false).users.find("1",false).id, 1, "collection_id", "Field name is correct")
  test.done();
}

