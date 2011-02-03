var User = require('./index').User;
var Collection = require('./index').Collection;
var Item = require('./index').Item;

Collection.toMany('items', Item, Item.fields["collection_id"]);
Collection.belongsTo('users',Collection.fields["user_id"], User);
