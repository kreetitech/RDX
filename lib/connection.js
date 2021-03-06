exports.ConnectionPool = function (config){
  this.connections = [];
  this.config = config;
  this.establishConnection = function() {
    this.connections.push(Connection(this.config));
    return this;
  };

  this.getConnection = function() {
    if(this.connections.length < 1) this.establishConnection();
    var rand = parseInt(Math.random() * this.connections.length);
    return this.connections[rand];
  }
}

var Connection = exports.Connection = function(config)
{
  var conn;
  if(config.adapter == 'mysql-libmysqlclient') {
    conn = require('mysql-libmysqlclient').createConnectionSync(config.host, config.user, config.password,
                                                                                            config.database, config.port, config.socket);
  } else if(config.adapter == 'mysql') {
// not supported
//    conn = new require('mysql').Client(config);
  }
  conn.adapter = config.adapter;
  //  this.__proto__ = conn;
  return conn;
}
