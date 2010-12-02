var Item_collection = require('./item').Item_collection


exports.testBelongsTo = function(test) {
  test.expect(1);
  test.equals(Item_collection()._chain.joinKey, "collection_id", "Field name is correct")
  test.done();
}

