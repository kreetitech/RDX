var Query = require('./query').Query;
var Utils = require('./utils').Utils;

var relationship_function = function(t) { return function() { t._chained_object = this;  return t; }};

var BelongsTo = exports.BelongsTo = function(join_table, join_key, primary_table, primary_key ){
  this.primaryTable = primary_table;
  this.primaryKey = primary_key;
  this.joinTable = join_table;
  this.joinKey = join_key;

  var t = Utils.clone(primary_table);
  t._chain = this;

  return relationship_function(t);
};

BelongsTo.prototype.query = function(chained_object) {
  var q = new Query();
  if(chained_object instanceof this.joinTable) {
    q._where = [this.primaryTable.tableName + "." + this.primaryKey  + '=' + chained_object[this.joinKey]];
  } else {
    q._joins = ["INNER JOIN " + this.joinTable.tableName + " ON " + this.joinTable.tableName + "." + this.joinKey + " = " +
	       this.primaryTable.tableName + "." + this.primaryKey];
  }
  return q;
};
