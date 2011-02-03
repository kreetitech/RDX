var User = require('./index').User;
var Collection = require('./index').Collection;

exports.testToMany = function(test) {
  test.expect(2);
  test.equals(User.collections._chain.joinKey.name, "user_id", "Field name is correct")
  test.equals(User.find("1",false).collections.find('1', false).id, 1, "Return value should be correct");
  test.done();
};
