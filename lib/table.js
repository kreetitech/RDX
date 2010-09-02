var Query = require('./query').Query;
var Record = require('./record').Record;
var Field = require('./field').Field;

var Table = exports.Table = Table = function(connection_pool, table_name) {
  this.table_name = table_name;
  this.connectionPool = connection_pool;
  this.primary_key = 'id';
  this.fields = this.connectionPool.getConnection().querySync('show fields from ' + table_name).fetchAllSync().map(function(f){ return new Field(f);});

  this.relationships = [];
  var func = new Function(arg) {
    if(arg) {
      for(var f in arg) {
	this[f] = arg[f];
      }
    }
  };
  for(var f in Record) {
    func.prototype[f] = Record[f];
  }
  func.__proto__ = this;
  return func;
};

Table.prototype.query = function() {
  var q = new Query();
  q._select = this.table_name + ".*";
  q._from = [this];
  q._connectionPool = this.connectionPool;
  return q;
}

Table.prototype.has_many = function(name, other_table, join_key) {
  this.prototype[name] = function() {
    var q = other_table.query().where(other_table.table_name + '.' + join_key + ' = ' + this.id);
    return q;
  };
};


