var cp = require('./setup').RDXTestConnectionPool();
var Table = require('table').Table;

var Collection = exports.Collection = new Table(cp, 'collections');
