var User = require('./index').User;
var Collection = require('./index').Collection;

exports.testBelongsTo = function(test) {
  test.expect(1);
  test.equals(Collection.findOne(false).users.find("1",false).id, 1, "collection_id", "Field name is correct")
  test.done();
}

