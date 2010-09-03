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
  q._chain = this._chain;
  q._chained_object = this._chained_object;
  return q;
}

ToMany = function(primary_table, primary_key, join_table, join_key ){
  this.primary_table = primary_table;
  this.primary_key = primary_key
  this.join_table = this.join_table;
  this.join_key = this.join_key;

  var t = Utils.clone(join_table);
  var t._chain = this;

  var f = new function() {
    t._chained_object = this;
    return t;
  }
  return f;
};

ToMany.prototype.query = function(chained_object) {
  var q = new Query();
  if(chained_object instanceof primary_table) {
    q._where = [this.join_table.table_name + "." + this.join_table.join_key  + '=' + chained_object[this.primary_key]];
  } else {
    q._join = ["INNER JOIN " + this.primary_table + " ON " + this.primary_table.table_name + "." + this.primary_key + " = " +
	       this.join_table.table_name + "." + this.join_table.join_key];
  }
  return q;
}
