var cp = require('./setup').RDXTestConnectionPool();
var Model = require('model');

var Item = exports.Item = new Model(cp, 'items');
