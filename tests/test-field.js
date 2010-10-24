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
  console.log(f._apply);
  test.ok(f._apply.indexOf('sum') != -1, "Operator is included");
  test.equals(f.toSql(), 'sum(users.id)', "Field to Sql is correct");
  test.done();
}