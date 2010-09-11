var cfg = require("./fixtures/config").cfg;
var ConnectionPool = require('connection').ConnectionPool;

var cp;

exports.RDXTestConnectionPool = function() {
  if(cp) { return cp; }
  return (cp = new ConnectionPool(cfg));
};
