var Query = require('./query').Query;
var Record = require('./record').Record;
var Field = require('./field').Field;
var Utils = require('./utils').Utils;

var table_function = function() {  return function(arg) { if(arg) {  Utils.extend(this, arg); }; };};


var Table = exports.Table = Table = function(connection_pool, table_name) {
  var me = this;
  this.tableName = table_name;
  this.connectionPool = connection_pool;
  this.primaryKey = 'id';
  this.fields = this.connectionPool.getConnection().querySync('show fields from ' + table_name).fetchAllSync().map(function(f){
      return new Field(me, f);});

  this.relationships = [];

  var func = table_function();
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
