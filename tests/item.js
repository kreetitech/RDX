var cp = require('./setup').RDXTestConnectionPool();
var Model = require('table').Model;

var Item = exports.Item = new Model(cp, 'items');
