var Query = require('./query').Query;
var Record = require('./record').Record;
var Field = require('./field').Field;
var Utils = require('./utils').Utils;
var Events = require('events');

var table_function = function() {  return function(arg) { if(arg) {  Utils.extend(this, arg); }; };};
table_function.prototype = Object.create(Events.EventEmitter.prototype);

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
  return q;
};

Table.prototype.all = function(callback) {
  var q = this.query();
  return callback === false ? q.executeSync() : q.execute(callback);
};

Table.prototype.findOne = function(callback) {
  var q = this.query().take(1);
  if(callback === false)
    return q.executeSync()[0]
  else 
    q.execute(function(err, res) {if(typeof(callback) === 'function') callback.call(q, err, res[0]);});
};

Table.prototype.find = function(ids, callback) {
  var q = this.query();
  var connection = this.connectionPool.getConnection();

  if(Array.isArray(ids)) {
    q = q.where(this.primaryKey.toSql() + ' in (' + connection.escapeSync(ids.join(",")) + ')');
  } else {
    q = q.where(this.primaryKey.toSql() + ' = ' + connection.escapeSync(ids));
  }
  if(callback === false) {
     var result = q.executeSync();
     if(Array.isArray(ids)) {
       if(result.length != ids.length) throw new Error("Could not find one or more record with " +  this.primaryKey + " "  + ids); 
     } else {
       result = result[0];
       if(!result) new Error("Could not find record with " +  this.primaryKey + " "  + ids);
     }
    return result;
  } else {
    q.execute(function(err, res) {
      if(typeof(callback) === 'function') {
         var result = res, error;
         if(Array.isArray(ids)) {
             error = new Error("Could not find one or more record with " +  this.primaryKey + " "  + ids); 
         } else {
             result = result[0];
             if(!result) error= new Error("Could not find record with " +  this.primaryKey + " "  + ids);
         }
        callback.call(q, err || error, result);
      }});
  }
};

Table.prototype.create = function(values, callback) {
  var tobe_inserted_values = values;
  var me = this;
  var connection = this.connectionPool.getConnection();
  if(!Array.isArray(values)) { tobe_inserted_values = [values]};
  var inserted_objects = tobe_inserted_values.map(function(value) { return new me(value) });
  
  if(typeof(callback) === 'function') {
    connection.querySync("begin");    
    inserted_objects.each(function(obj){ obj.save(false);});
    connection.commitSync();
    return Array.isArray(values) ? inserted_objects : inserted_objects[0];
  } else {
    connection.querySync("begin");    
      /* TODO - need some library */
//    inserted_objects.each(function(obj){ obj.save(false);});
    connection.commitSync();
  }
}

Table.prototype.toMany = function(prop, joinTable, joinKey) {
  if(!(joinTable instanceof Table)) new Error(joinTable + " is not an instance of Table");
  if(!(joinKey instanceof Field)) new Error(joinKey + " is not an instance of Field");
  var ToMany = require('./to_many').ToMany;
  Object.defineProperty(this.prototype, prop, {get: function(){return new ToMany(this, joinTable, joinKey);}});
  Object.defineProperty(this, prop, {get: function(){return new ToMany(this, joinTable, joinKey);}});
}

Table.prototype.toString = function() {
  return "<Table:{" + this.tableName + "}>";
};

