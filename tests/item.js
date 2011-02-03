var Collection = require('./index').Collection;
var Item = require('./index').Item;

Item.belongsTo('collections',Item.fields["collection_id"], Collection);
