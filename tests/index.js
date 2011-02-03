var cfg = require("./fixtures/config").cfg;
var ConnectionPool = require('connection').ConnectionPool;
var Model = require('model');

var exports = module.exports = new Object;

var cp = new ConnectionPool(cfg);

exports.User = new Model(cp, 'users');
exports.Collection = new Model(cp, 'collections');
exports.Item = new Model(cp, 'items');

require('./user');
require('./collection');
require('./item');