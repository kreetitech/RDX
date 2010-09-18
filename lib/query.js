var Field = require('./field').Field;
var Utils = require('./utils').Utils;


var Query = exports.Query = function (){
  this._select = [];
  this._from = [];
  this._where = [];
  this._order = [];
  this._joins = [];
  this._group = null;
  this._having = null;
  this._limit = null;
  this._offset = null;
  this._connectionPool = null;
  this._chain = null;
  this._chained_object = null;
};

Query.prototype.toSql = function () {
  var chain = this._chain;
  var chained_object = this._chained_object;
  var q = this;
  while(chain) {
    q = q.merge(chain.query(chained_object));
    chain = chained_object._chain;
    chained_object = chained_object._chained_object;
  }
  var sql = "select " + (q._select.map(function(f){return (f instanceof Field) ? f.toSql() : f.toString(); }).join(",") || "*");
  sql += " from " + q._from.map(function(t){return t.tableName;}).join(", ");
  sql += " " + q._joins.join(" ");

  sql += q.whereStatement();

  if(q._group)
    sql += " group by " + q._group;
  if(q._having)
    sql += " having " + q._having;
  if(q._order.length > 0)
    sql += " order by " + q._order;
  if(q._limit)
    sql += " limit " + q._limit;
  if(q._offset)
    sql += " offset " + q._offset;

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

Query.prototype.select = function (field) {
  var q = Utils.clone(this);
  q._select = q._select.concat(field);
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
  q._select = q._select.concat(['sum(' + ((field instanceof Field) ? field.toSql() : field.toString()) + ')']);
  return q;
}

Query.prototype.min = function (field) {
  var q = Utils.clone(this);
  q._select = q._select.concat(['min(' + ((field instanceof Field) ? field.toSql() : field.toString()) + ')']);
  return q;
}

Query.prototype.max = function (field) {
  var q = Utils.clone(this);
  q._select = q._select.concat(['max(' + ((field instanceof Field) ? field.toSql() : field.toString()) + ')']);
  return q;
}

Query.prototype.avg = function (field) {
  var q = Utils.clone(this);
  q._select = q._select.concat(['avg(' + ((field instanceof Field) ? field.toSql() : field.toString()) + ')']);
  return q;
}

Query.prototype.merge = function (other_query) {
  var q = Utils.clone(this);
  q._select = this._select.concat(other_query._select);
  q._from = this._from.concat(other_query._from);
  q._joins = this._joins.concat(other_query._joins);
  q._where = this._where.concat(other_query._where);
  q._order = this._order.concat(other_query._order);

  return q;
}

Query.prototype.whereStatement = function() {
  if(this._where && this._where.length > 0)
    return " where " + this._where.join(" and ");
  return "";
}

