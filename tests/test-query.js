var Query = require('query').Query;

var Collection = require('./collection').Collection;

var User = require('./user').User;

exports.testQueryWhere = function(test) {
  test.expect(3);
  test.equals(User.query().where('id = 1').executeSync()[0].id, 1, "Returns object with correct matching id.");
  test.equals(User.query().where("first_name = 'sandip'").executeSync()[0].first_name, "sandip", "Returns object with matching name");
  test.equals(User.query().where("first_name = 'sandip'").where("last_name='mondal'").executeSync()[0].first_name, "sandip","Return object with matching name");
  test.done();
}

exports.testQuerySelect = function(test) {
  test.expect(2);
  test.equals(User.query().select('id').executeSync()[0].id, 1, "Returns value should be 1");
  test.equals(User.query().select('id').select('first_name').executeSync()[0].first_name, 'sandip',"Returns object with matching name");
  //  test.equals(User.query().group('user_type').executeSync()[0].id, "1", "value should be correct");
  test.done();
}

exports.testQueryLimit = function(test) {
  test.expect(2)
  test.equals(User.query().take(2).executeSync()[0].id, 1, "Returns value should be correct");
  test.ok(User.query().take().executeSync(), "Should Return argument error");
  test.done();
}

exports.testQueryGroup = function(test) {
  test.expect(4)
  test.equals(User.query().group('user_type').executeSync()[0].id, 1, "Returns value with correct matching value");
  test.equals(User.query().group('salt').executeSync().length, "1", "Returns value with correct matching value");
  test.equals(User.query().group('user_type').executeSync().length, "2", "Returns value with correct matching value");
  test.equals(User.query().group('user_type').group('last_name').executeSync().length, "5", "Returns value with correct matching value");
  test.done();
}

exports.testQuerySum = function(test) {
  test.expect(1);
  test.equals(Collection.query().sum('items_count').executeSync()[0], 5, "Returns value with correct matching value");
  test.done();
}

exports.testQueryCount = function(test) {
  test.expect(3);
  test.equals(User.query().count('*').executeSync()[0], 5, "Returns value with correct matching value" ); // pending
  test.equals(User.query().count('*').where('user_type=1').executeSync(), 3, "Returns value with correct matching value");
  test.equals(User.query().count(1).executeSync()[0].count(1), 5, "Returns value with correct matching value");
  test.done();
}

exports.testQueryMin = function(test) {
  test.expect(1);
  test.equals(Collection.query().min('items_count').executeSync()[0], 1, "Returns value with correct matching value");
  test.done();
}

exports.testQueryAll = function(test) {
  test.expect(4);
  test.equals(User.query().select('id').where('id=1').executeSync()[0].id, 1, "Returns object with correct matching id.");
  test.equals(User.query().select('id').where('id=1').executeSync()[0].id, 1, "Returns object with correct matching id.");
  test.equals(User.query().select('id').select('first_name').where('id=1').executeSync()[0].first_name, 'sandip', "Return object with matching name");
  test.equals(User.query().select('id').select('first_name').where("first_name='sandip'").executeSync()[0].first_name, 'sandip', "Return object with matching name");
  test.done();
}
