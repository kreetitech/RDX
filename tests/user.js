var cp = require('./setup').RDXTestConnectionPool;
var Table = require('table').Table;
var User = exports.User = new Table(cp(), 'users');
