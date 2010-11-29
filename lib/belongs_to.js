var Query = require('./query').Query;
var Utils = require('./utils').Utils;
var Table = require('./table').Table;
var Field = require('./field').Field;

var BelongsTo = exports.BelongsTo = function(chained_object, join_key, join_table) {
  if(!(join_table instanceof Table)) new Error(join_table + " is not an instance of Table");
  if(!(join_key instanceof Field)) new Error(join_key + " is not an instance of Field");

  this._chained_object = chained_object;
  this.joinTable = join_table;
  this.joinKey = join_key;

  var t = Utils.clone(join_table);
  t._chain = this;

  return t;
};

BelongsTo.prototype.query = function() {
  var q = new Query();
  var connection = this.joinTable.connectionPool.getConnection();

  if(this._chained_object instanceof Table) {
    q._joins = ["INNER JOIN " + this._chained_object.tableName + " ON " + this.joinKey.toSql() + " = " + this._chained_object.primaryKey.toSql()];
  } else {
    q._where = [this.joinTable.primaryKey.toSql()  + '=' + connection.escapeSync('' + this._chained_object[this.joinKey.name])];
  }
  return q;
};
