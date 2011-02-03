var Field = require('./field');
var Query = require('./query');
var Record = require('./record');
var Utils = require('./utils');

var table_function = function() {  return function(arg) { Record.call(this); if(arg) {  Utils.extend(this, arg); }; };};

var Model = function(connection_pool, table_name) {
  Query.call(this);

  var func = table_function();
//  func.prototype = new Record();
  func.prototype.__proto__ = Record.prototype;
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

module.exports = Model;

Model.prototype.__proto__ = Query.prototype;
//Model.prototype = new Query();

Model.prototype.query = function() {
  var q = Utils.clone(this);
  q._from = [this];
  q._chain = this._chain;
  return q;
};

Model.prototype.all = function(callback) {
  var q = this.query();
  return callback === false ? q.executeSync() : q.execute(callback);
};

Model.prototype.findOne = function(callback) {
  var q = this.query().take(1);
  if(callback === false)
    return q.executeSync()[0]
  else 
    q.execute(function(err, res) {if(typeof(callback) === 'function') callback.call(q, err, res[0]);});
};

Model.prototype.find = function(ids, callback) {
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

Model.prototype.create = function(value, callback) {
  var me = this;
  var connection = this.connectionPool.getConnection();
  var new_object = new me(value);

  if(callback === false) {
    connection.querySync("begin");    
    new_object.save(false);
    connection.commitSync();
    return new_object;
  } else {
    new_object.save(callback);
  }
}

Model.prototype.toMany = function(prop, joinModel, joinKey) {
  if(!(joinModel instanceof Model)) new Error(joinModel + " is not an instance of Model");
  if(!(joinKey instanceof Field)) new Error(joinKey + " is not an instance of Field");
  var ToMany = require('./to_many');
  Object.defineProperty(this.prototype, prop, {get: function(){return new ToMany(this, joinModel, joinKey);}});
  Object.defineProperty(this, prop, {get: function(){return new ToMany(this, joinModel, joinKey);}});
}

Model.prototype.belongsTo = function(prop, joinKey, joinModel) {
  if(!(joinModel instanceof Model)) new Error(joinModel + " is not an instance of Model");
  if(!(joinKey instanceof Field)) new Error(joinKey + " is not an instance of Field");
  var BelongsTo = require('./belongs_to');
  Object.defineProperty(this.prototype, prop, {get: function(){return new BelongsTo(this, joinKey, joinModel);}});
  Object.defineProperty(this, prop, {get: function(){return new BelongsTo(this, joinKey, joinModel);}});
}

Model.prototype.toString = function() {
  return "<Model:{" + this.tableName + "}>";
};
