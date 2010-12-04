var cp = require('./setup').RDXTestConnectionPool();
var Table = require('table').Table;
var Item = require('./item').Item;
var User = require('./user').User;

var Collection = exports.Collection = new Table(cp, 'collections');

Collection.toMany('items', Item, Item.fields["collection_id"]);
