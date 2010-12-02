var Query = require('query').Query;

var User = require('./user').User;
var Collection = require('./collection').Collection;

exports.testTableObjectCreation = function(test) {
  test.expect(4);
  test.equals(User.tableName, "users", "The table name is stored correctly.");
  test.equals(User.primaryKey, User.fields["id"], "The default primary key field is: id.");
  test.equals(User.primaryKey.name, "id", "The default primary key name is: id.");
  test.equals(User.fields.length, 14, "The field count is correct.");

  test.done();
};

exports.testTableQueryObject = function(test) {
  test.expect(2);
  test.ok(User.query() instanceof Query, "Returns an instance of query object.");
  test.ok(User.query()._from.indexOf(User) != -1, "The query contains the table as form object.");
  test.done();
};

exports.testTableToString = function(test) {
  test.expect(1);
  test.ok(User.toString(), "<Table:{users}>", "Returns correct string representation.");
  test.done();
};

exports.testTableNewObjectConstruction = function(test) {
  test.expect(2);
  var obj = new User();
  test.ok(obj instanceof User, "Returns an instance of Model.");
  test.equals(obj.constructor, User, "Object constructor is Model Class.");
  test.done();
};

exports.testTableallSync = function(test) {
  test.expect(2)
  test.equals(User.all(false).length, 5, "Return length should be correct")
  test.ok(User.all(false) instanceof Array, "Return length should be correct")
  test.done();
};

exports.testTableall = function(test) {
  test.expect(1);
  User.all(function(err, res){test.ok(res instanceof Array, "correct"); test.done(); });
};

exports.testTablefindOneSync = function(test) {
  test.expect(1);
  test.equals(User.findOne(false).first_name, "sandip", "Return object with matching name")
  test.done();
};

exports.testTablefindOne = function(test) {
  test.expect(1);
  User.findOne(function(err, res) {test.equals(res.first_name, "sandip", "Return object with matching name"); test.done(); });
};

exports.testTablefindSync = function(test) {
  test.expect(4);
  test.equals(User.find("1", false).first_name, "sandip", "Return object with matching name");
  test.ok(User.find("1", false) instanceof Object, "Return an instance of Object");
  test.equals(User.find(["1","2","3"], false)[2].id, 3, "Returns value with correct matching value");
  test.ok(User.find(["1","2","3"], false) instanceof Array, "Return an instance of Array");
  test.done();
};

exports.testTablefind = function(test) {
  test.expect(2);
  User.find("1", function(err, res){
    test.equals(res.first_name, "sandip","Return object with matching name");
    test.ok(res instanceof Object, "Return an instance of Object");
    test.done()});
};

