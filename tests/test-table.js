var Query = require('query').Query;

var User = require('./user').User;
var Collection = require('./collection').Collection;

exports.testTableObjectCreation = function(test) {
  test.expect(3);
  test.equals(User.tableName, "users", "The table name is stored correctly.");
  test.equals(User.primaryKey, "id", "The default primary key is field: id.");
  test.equals(User.fields.length, 14, "The field count is correct.");

  test.done();
};

exports.testTableQueryObject = function(test) {
  test.expect(2);
  test.ok(User.query() instanceof Query, "Returns an instance of query object.");
  test.ok(User.query()._from.indexOf(User) != -1, "The query contains the table as form object.");
  test.done();
};

exports.testTableNewObjectConstruction = function(test) {
  test.expect(2);
  var obj = new User();
  test.ok(obj instanceof User, "Returns an instance of Model.");
  test.equals(obj.constructor, User, "Object constructor is Model Class.");
  test.done();
};

