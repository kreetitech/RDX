var cp = require('./setup').RDXTestConnectionPool();
var Table = require('table').Table;

var Item = exports.Item = new Table(cp, 'items');
