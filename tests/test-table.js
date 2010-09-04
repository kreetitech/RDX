var cfg = require("./fixtures/config").cfg;
var ConnectionPool = require('connection').ConnectionPool;
var Table = require('table').Table;
var Query = require('query').Query;

var cp = new ConnectionPool(cfg);


var collections = new Table(cp, 'collections');

exports.testTableObjectCreation = function(test) {
  test.expect(3);
  var users = new Table(cp, 'users');
  test.equals(users.tableName, "users", "The table name is stored correctly.");
  test.equals(users.primaryKey, "id", "The default primary key is field: id.");
  test.ok(users.fields.length > 0, "Stores, the fields for the table.");

  test.done();
};

exports.testTableQueryObject = function(test) {
  test.expect(2);
  var users = new Table(cp, 'users');
  test.ok(users.query() instanceof Query, "Returns an instance of query object.");
  test.ok(users.query()._from.indexOf(users) != -1, "The query contains the table as form object.");
  test.done();
};

