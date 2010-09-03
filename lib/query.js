var Field = require('./field').Field;
var Utils = require('./utils').Utils;


var Query = exports.Query = function (){
  this._select = [];
  this._from = [];
  this._where = [];
  this._order = null;
  this._joins = [];
  this._group = null;
  this._having = null;
  this._limit = null;
  this._offset = null;
  this._connectionPool = null;
};

Query.prototype.toSql = function () {
  var sql = "select " + (this._select.map(function(f){return (field instanceof Field) ? field.toSql() : field.toString(); }).join(",") || "*");
  sql += " from " + this._from.map(function(t){return t.table_name;}).join(", ");
  sql += " " + this._joins.join(" ");

  sql += this.whereStatement();

  if(this._group)
    sql += " group by " + this._group;
  if(this._having)
    sql += " order by " + this._having;
  if(this._order)
    sql += " order by " + this._order;
  if(this._limit)
    sql += " limit " + this._limit;
  if(this._offset)
    sql += " offset " + this._offset;

  return sql;
}

Query.prototype.executeSync = function () {
  var results = this._connectionPool.getConnection().querySync(this.toSql()).fetchAllSync();
  var model = this._from[0];
  if(results && model) {
    return results.map(function(res) {
            var m = new model();
            for(f in res) {m[f] = res[f];}
            return m;
          });
  }
  return results;
}

Query.prototype.where = function (obj) {
  var q = Utils.clone(this);
  q._where = q._where.concat(obj);
  return q;
}

Query.prototype.take = function (obj) {
  var q = Utils.clone(this);
  q._limit = obj;
  return q;
}

Query.prototype.group = function (obj) {
  var q = Utils.clone(this);
  q._group = obj;
  return q;
}

Query.prototype.having = function (obj) {
  var q = Utils.clone(this);
  q._having = obj;
  return q;
}

Query.prototype.skip = function (obj) {
  var q = Utils.clone(this);
  q._offset = obj;
  return q;
}

Query.prototype.join = function (join_query) {
  var q = Utils.clone(this);
  q._joins = q._joins.concat(join_query);
  return q;
}

Query.prototype.select = function (select) {
  var q = Utils.clone(this);
  q._select = select;
  return q;
}

Query.prototype.count = function (field) {
  var q = Utils.clone(this);
  var f = "1";
  if(field instanceof Field) {
    f = field.toSql();
  } else if(field) {
    f = field.toString();
  }
  q._select = q._select.concat(['count(' + f + ')']);
  return q;
}

Query.prototype.sum = function (field) {
  var q = Utils.clone(this);
  q._select = q._select.concat(['sum(' + ((field instanceof Field) ? field.toSql() + field.toString()) + ')']);
  return q;
}

Query.prototype.min = function (field) {
  var q = Utils.clone(this);
  q._select = q._select.concat(['min(' + ((field instanceof Field) ? field.toSql() + field.toString()) + ')']);
  return q;
}

Query.prototype.max = function (field) {
  var q = Utils.clone(this);
  q._select = q._select.concat(['max(' + ((field instanceof Field) ? field.toSql() + field.toString()) + ')']);
  return q;
}

Query.prototype.avg = function (field) {
  var q = Utils.clone(this);
  q._select = q._select.concat(['avg(' + ((field instanceof Field) ? field.toSql() + field.toString()) + ')']);
  return q;
}

Query.prototype.whereStatement = function() {
  if(this._where && this._where.length > 0)
    return " where " + this._where.join(" and ");
  return "";
}

