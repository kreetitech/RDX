var Query = require('query').Query;

var User = require('./user').User

exports.testQueryWhere = function(test) {
  test.expect(2);
  test.equals(User.query().where('id = 1').executeSync()[0].id, 1, "Returns object with correct matching id.");
  test.equals(User.query().where("first_name = 'sandip'").executeSync()[0].first_name, "sandip", "Returns object with matching name");
  test.done();
}

exports.testQuerySelect = function(test) {
  test.expect(1);
  test.equals(User.query().select('id').executeSync()[0].id, 1, "value should be 1");
  //  test.equals(User.query().group('user_type').executeSync()[0].id, "1", "value should be correct");

  test.done();
}
