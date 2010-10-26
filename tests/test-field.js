var User = require('./user').User;

exports.testFieldObjectCreation = function(test) {
  test.expect(5);
  test.equals(User.fields[0].name, "id", "Field name is correct");
  test.equals(User.fields[0].type, "int(11)", "Field type is correct");
  test.equals(User.fields[0].null, false, "Field is not null");
  test.equals(User.fields[0].default, null, "Field has null as default");
  test.equals(User.fields[0].table, User, "Field table is user");
  test.done();
}

exports.testFieldSum = function(test) {
  test.expect(3);
  var f = User.fields[0].sum();
  test.notEqual(User.fields[0], f, "Field is cloned");
  test.ok(f._apply.indexOf('sum') != -1, "Operator is included");
  test.equals(f.toSql(), 'sum(users.id)', "Field to Sql is correct");
  test.done();
}

exports.testFieldMax = function(test) {
  test.expect(3);
  var f = User.fields[0].max();
  test.notEqual(User.fields[0], f, "Field is cloned");
  test.ok(f._apply.indexOf('max') != -1, "Operator is included");
  test.equals(f.toSql(), 'max(users.id)', "Field to Sql is correct");
  test.done();
}

exports.testFieldMin = function(test) {
  test.expect(3);
  var f = User.fields[0].min();
  test.notEqual(User.fields[0], f, "Field is cloned");
  test.ok(f._apply.indexOf('min') != -1, "Operator is included");
  test.equals(f.toSql(), 'min(users.id)', "Field to Sql is correct");
  test.done();
}


exports.testFieldCount = function(test) {
  test.expect(3);
  var f = User.fields[0].count();
  test.notEqual(User.fields[0], f, "Field is cloned");
  test.ok(f._apply.indexOf('count') != -1, "Operator is included");
  test.equals(f.toSql(), 'count(users.id)', "Field to Sql is correct");
  test.done();
}

exports.testFieldAvg = function(test) {
  test.expect(3);
  var f = User.fields[0].avg();
  test.notEqual(User.fields[0], f, "Field is cloned");
  test.ok(f._apply.indexOf('avg') != -1, "Operator is included");
  test.equals(f.toSql(), 'avg(users.id)', "Field to Sql is correct");
  test.done();
}



