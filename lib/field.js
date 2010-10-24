var Utils = require('./utils').Utils;

Field = exports.Field = function(table, field_desc) {
  if(field_desc) {
    if(typeof(field_desc) === 'string') {
      this.name = field_desc;
    } else {
      this.name = field_desc.Field;
      this.type = field_desc.Type;
      this.null = field_desc.NULL === "YES";
      this.default = field_desc.Default;
    }
  }
  this._apply = [];
  this._alias;
  this.table = table;
}

Field.prototype.toSql = function() {
  var fn = (this.table ? this.table.tableName + '.' : '') + (this.name ? this.name : '*');
  this._apply.map(function(o){ fn = o + "(" + fn + ")"; });
  if(this._alias) { fn = fn + ' as ' + this._alias; }
  return fn
}

Field.prototype.sum = function() {
  var f = Utils.clone(this);
  f._apply = f._apply.concat('sum');
  return f;
}

Field.prototype.max = function() {
  var f = Utils.clone(this);
  f._apply = f._apply.concat('max');
  return f;
}

Field.prototype.min = function() {
  var f = Utils.clone(this);
  f._apply = f._apply.concat('min');
  return f;
}

Field.prototype.avg = function() {
  var f = Utils.clone(this);
  f._apply = f._apply.concat('avg');
  return f;
}

Field.prototype.count = function (field) {
  var f = Utils.clone(this);
  f._apply = f._apply.concat('count');
  return f;
}

Field.prototype.as = function (alias) {
  var f = Utils.clone(this);
  f._alias = alias;
  return f;
}
