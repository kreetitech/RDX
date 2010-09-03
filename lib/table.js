var Query = require('./query').Query;
var Record = require('./record').Record;
var Field = require('./field').Field;
var Utils = require('./utils').Utils;

var Table = exports.Table = Table = function(connection_pool, table_name) {
  var me = this;
  this.table_name = table_name;
  this.connectionPool = connection_pool;
  this.primary_key = 'id';
  this.fields = this.connectionPool.getConnection().querySync('show fields from ' + table_name).fetchAllSync().map(function(f){
      return new Field(me, f);});

  this.relationships = [];
  var func = new Function(arg) {
    if(arg) {
      Utils.extend(this, arg);
    }
  };
  Utils.extend(func.prototype, Record);

  func.__proto__ = this;
  return func;
};

Table.prototype.query = function() {
  var q = new Query();
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


