var cp = require('./setup').RDXTestConnectionPool();
var Model = require('model');

var Collection = require('./collection').Collection;

var User = exports.User = new Model(cp, 'users');
User.toMany('collections', Collection, Collection.fields["user_id"]);
