var Query = exports.Query = function (){
  this._select = '';
  this._from = [];
  this._where = [];
  this._order = null;
  this._group = null;
  this._having = null;
  this._limit = null;
  this._offset = null;
  this._connectionPool = null;
};

Query.prototype.toSql = function () {
  var sql = "select " + this._select;
  sql += " from " + this._from.map(function(t){return t.table_name;}).join(", ");
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

Query.prototype.execute = function () {
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
  var q = clone(this);  
  q._where = q._where.concat(obj);
  return q;
}

Query.prototype.whereStatement = function() {
  if(this._where && this._where.length > 0)
    return " where " + this._where.join(" and ");
  return "";
}

function Clone() { }
function clone(obj) {
    Clone.prototype = obj;
    return new Clone();
}
