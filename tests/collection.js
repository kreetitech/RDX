var cp = require('./setup').RDXTestConnectionPool();
var Model = require('table').Model;
var Item = require('./item').Item;

var Collection = exports.Collection = new Model(cp, 'collections');
Collection.toMany('items', Item, Item.fields["collection_id"]);
