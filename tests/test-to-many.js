var User = require('./user').User;
var Collection = require('./collection').Collection;

User.toMany('collection', Collection, Collection.fields["user_id"]);

exports.testToMany = function(test) {
  test.expect(2);
  test.equals(User.collection._chain.joinKey.name, "user_id", "Field name is correct")
  test.equals(User.find("1",false).collection.find('1', false).id, 1, "Return value should correvt");
  test.done();
};
