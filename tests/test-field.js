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