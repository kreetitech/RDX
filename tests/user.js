var cp = require('./setup').RDXTestConnectionPool;
var Table = require('table').Table;
var Collection = require('./collection').Collection;

var User = exports.User = new Table(cp(), 'users');
User.toMany('collections', Collection, Collection.fields["user_id"]);
