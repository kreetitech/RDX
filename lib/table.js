var Query = require('./query').Query;
var Record = require('./record').Record;
var Field = require('./field').Field;
var Utils = require('./utils').Utils;

var table_function = function() {  return function(arg) { if(arg) {  Utils.extend(this, arg); }; };};

var Table = exports.Table = Table = function(connection_pool, table_name) {
  var func = table_function();
  Utils.extend(func.prototype, Record);
  func.__proto__ = this;

  var me = func;
  this.tableName = table_name;
  this.connectionPool = connection_pool;
  this.fields = [];
  this.connectionPool.getConnection().querySync('show fields from ' + table_name).fetchAllSync().forEach(function(f){
      var f = new Field(me, f);
      me.fields.push(f);
      me.fields[f.name] = f; });
  this.primaryKey = this.fields[0];

  this.relationships = [];

  return func;
};

Table.prototype.query = function() {
  var q = new Query();
  q._from = [this];
  q._connectionPool = this.connectionPool;
  q._chain = this._chain;
  q._chained_object = this._chained_object;
  return q;
};

Table.prototype.allSync = function() {
  var q = this.query();
  return q.executeSync();
};

Table.prototype.findOneSync = function() {
  var q = this.query().take(1);
  return q.executeSync()[0];
};

Table.prototype.findSync = function(ids) {
  var q = this.query();
  var result;
  if(Array.isArray(ids)) {
    result = q.where(this.primaryKey.toSql() + ' in (' + ids.join(",") + ')').executeSync();
    if(result.length != ids.length) throw new Error("Could not find one or more record with " +  this.primaryKey + " "  + ids);
  } else {
    result = q.where(this.primaryKey.toSql() + ' = ' + ids).executeSync()[0];
    if(!result) new Error("Could not find record with " +  this.primaryKey + " "  + ids);
  }
  return result;
};

Table.prototype.createSync = function(values) {
    var tobe_inserted_values = values;
    var me = this;
    var connection = this.connectionPool.getConnection();
    connection.querySync("begin");    
    if(!Array.isArray(values)) { tobe_inserted_values = [values]};
    var inserted_objects = tobe_inserted_values.map(function(value) {
      var obj = new me(value);
      obj.saveSync();
      return obj;
    });
    connection.commitSync();
    return Array.isArray(values) ? inserted_objects : inserted_objects[0];
}

Table.prototype.toString = function() {
  return "<Table:{" + this.tableName + "}>";
};