var Utils = require('./utils');
var Model = require('./model');
var Field = require('./field');
var Query = require('./query');

var ToMany = function(chained_object, join_table, join_key ){
  if(!(join_table instanceof Model)) new Error(join_table + " is not an instance of Model");
  if(!(join_key instanceof Field)) new Error(join_key + " is not an instance of Field");

  this._chained_object = chained_object;
  this.joinModel = join_table;
  this.joinKey = join_key;
   
  var t = Utils.clone(join_table);
  t._chain = this;

  return t;
};

module.exports = ToMany;

ToMany.prototype.query = function() {
  var q = new Query();
  var connection = this.joinModel.connectionPool.getConnection();

 if(this._chained_object instanceof Model) {
    q._joins = ["INNER JOIN " + this._chained_object.tableName + " ON " + this._chained_object.primaryKey.toSql() + " = " + this.joinKey.toSql()];
  } else {
    q._where = [this.joinKey.toSql()  + '=' + connection.escapeSync('' + this._chained_object[this._chained_object.constructor.primaryKey.name])];
  }
  return q;
};
