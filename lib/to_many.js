var Query = require('./query').Query;
var Utils = require('./utils').Utils;

var relationship_function = function(t) { return function() { t._chained_object = this;  return t; }};

var ToMany = exports.ToMany = function(primary_table, primary_key, join_table, join_key ){
  this.primaryTable = primary_table;
  this.primaryKey = primary_key;
  this.joinTable = join_table;
  this.joinKey = join_key;

  var t = Utils.clone(join_table);
  t._chain = this;

  return relationship_function(t);
};

ToMany.prototype.query = function(chained_object) {
  var q = new Query();
  if(chained_object instanceof this.primaryTable) {
    q._where = [this.joinTable.tableName + "." + this.joinKey  + '=' + chained_object[this.primaryKey]];
  } else {
    q._joins = ["INNER JOIN " + this.primaryTable.tableName + " ON " + this.primaryTable.tableName + "." + this.primaryKey + " = " +
	       this.joinTable.tableName + "." + this.joinKey];
  }
  return q;
};
