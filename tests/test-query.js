var Query = require('query');
var Field = require('field');

var Collection = require('./index').Collection;
var User = require('./index').User;

exports.testQueryWhereSync = function(test) {
  test.expect(3);
  test.equals(User.query().where('id = 1').executeSync()[0].id, 1, "Returns object with correct matching id.");
  test.equals(User.query().where("first_name = 'sandip'").executeSync()[0].first_name, "sandip", "Returns object with matching name");
  test.equals(User.query().where("first_name = 'sandip'").where("last_name='mondal'").executeSync()[0].first_name, "sandip","Return object with matching name");
  test.done();
}

exports.testQueryWhere = function(test) {
  test.expect(3);
  User.query().where('id = 1').execute(function(err, res) {test.equals(res[0].id, 1, "Returns object with correct matching id.");});
  User.query().where("first_name = 'sandip'").execute(function(err, res) {test.equals(res[0].first_name, "sandip", "Returns object with matching name")});
  User.query().where("first_name = 'sandip'").where("last_name='mondal'").execute(function(err, res) {test.equals(res[0].first_name, "sandip","Return object with matching name"); test.done();});

}

exports.testQuerySelectSync = function(test) {
  test.expect(2);
  test.equals(User.query().select('id').executeSync()[0].id, 1, "Returns value should be 1");
  test.equals(User.query().select('id').select('first_name').executeSync()[0].first_name, 'sandip',"Returns object with matching name");
  //  test.equals(User.query().group('user_type').executeSync()[0].id, "1", "value should be correct");
  test.done();
};

exports.testQuerySelect = function(test){
  test.expect(1);
  User.query().select('id').execute( function(err, res){test.equals(res[0].id, 1, "Returns value should be correct"); test.done();});
};

exports.testQueryLimitSync = function(test) {
  test.expect(2)
  test.equals(User.query().take(2).executeSync()[0].id, 1, "Returns value should be correct");
  test.ok(User.query().take().executeSync(), "Should Return argument error");
  test.done();
};

exports.testQueryLimit = function(test) {
  test.expect(1);
  User.query().take(1).execute(function(err, res) {test.equals(res[0].id, 1, "Returns value with correct matching value");
  test.done();});
};

exports.testQueryGroup = function(test) {
  test.expect(4)
  test.equals(User.query().group('user_type').executeSync()[0].id, 1, "Returns value with correct matching value");
  test.equals(User.query().group('salt').executeSync().length, 1, "Returns value with correct matching value");
  test.equals(User.query().group('user_type').executeSync().length, 2, "Returns value with correct matching value");
  test.equals(User.query().group('user_type').group('last_name').executeSync().length, 4, "Returns value with correct matching value");
  test.done();
}

exports.testQuerySum = function(test) {
  test.expect(1);
  test.equals(Collection.query().select(new Field(null,'items_count').sum().as('items_count')).executeSync()[0].items_count, 5, "Returns value with correct matching value");
  test.done();
}

exports.testQueryCount = function(test) {
  test.expect(2);
  test.equals(User.query().select(new Field().count().as('count')).executeSync()[0].count, 5, "Returns value with correct matching value" );
  test.equals(User.query().select(new Field().count().as('count')).where('user_type=1').executeSync()[0].count, 3, "Returns value with correct matching value");
  test.done();
}

exports.testQueryMin = function(test) {
  test.expect(1);
  test.equals(Collection.query().select(new Field(null,'items_count').min().as('min')).executeSync()[0].min, 1, "Returns value with correct matching value");
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
