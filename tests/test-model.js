var Model = require('model');
var Query = require('query');

var User = require('./user').User;
var Collection = require('./collection').Collection;

exports.testModelObject = function(test) {
  test.expect(3);
  test.ok(User instanceof Model, "User is an instance of Model Class.");
  test.ok(User instanceof Query, "User is an instance of Query Class.");
  test.equals(User.constructor, Model, "User constructor is Model class.");

  test.done();
};

exports.testModelObjectCreation = function(test) {
  test.expect(4);
  test.equals(User.tableName, "users", "The table name is stored correctly.");
  test.equals(User.primaryKey, User.fields["id"], "The default primary key field is: id.");
  test.equals(User.primaryKey.name, "id", "The default primary key name is: id.");
  test.equals(User.fields.length, 14, "The field count is correct.");

  test.done();
};

exports.testModelQueryObject = function(test) {
  test.expect(2);
  test.ok(User.query() instanceof Query, "Returns an instance of query object.");
  test.ok(User.query()._from.indexOf(User) != -1, "The query contains the table as form object.");
  test.done();
};

exports.testModelToString = function(test) {
  test.expect(1);
  test.ok(User.toString(), "<Model:{users}>", "Returns correct string representation.");
  test.done();
};

exports.testModelNewObjectConstruction = function(test) {
  test.expect(2);
  var obj = new User();
  test.ok(obj instanceof User, "Returns an instance of Model.");
  test.equals(obj.constructor, User, "Object constructor is Model Class.");
  test.done();
};

exports.testModelallSync = function(test) {
  test.expect(2)
  test.equals(User.all(false).length, 5, "Return length should be correct")
  test.ok(User.all(false) instanceof Array, "Return length should be correct")
  test.done();
};

exports.testModelall = function(test) {
  test.expect(1);
  User.all(function(err, res){test.ok(res instanceof Array, "correct"); test.done(); });
};

exports.testModelfindOneSync = function(test) {
  test.expect(1);
  test.equals(User.findOne(false).first_name, "sandip", "Return object with matching name")
  test.done();
};

exports.testModelfindOne = function(test) {
  test.expect(1);
  User.findOne(function(err, res) {test.equals(res.first_name, "sandip", "Return object with matching name"); test.done(); });
};

exports.testModelfindSync = function(test) {
  test.expect(4);
  test.equals(User.find("1", false).first_name, "sandip", "Return object with matching name");
  test.ok(User.find("1", false) instanceof Object, "Return an instance of Object");
  test.equals(User.find(["1","2","3"], false)[2].id, 3, "Returns value with correct matching value");
  test.ok(User.find(["1","2","3"], false) instanceof Array, "Return an instance of Array");
  test.done();
};

exports.testModelfind = function(test) {
  test.expect(2);
  User.find("1", function(err, res){
    test.equals(res.first_name, "sandip","Return object with matching name");
    test.ok(res instanceof Object, "Return an instance of Object");
    test.done()});
};

