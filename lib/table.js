var Query = require('./query').Query;

var Table = exports.Table = Table = function(connection_pool, table_name) {
  this.table_name = table_name;
  this.connectionPool = connection_pool;
  this.primary_key = 'id';
  this.fields = this.connectionPool.getConnection().querySync('show fields from ' + table_name).fetchAllSync().map(function(f){ return new Field(f);});

  this.relationships = [];
  var func = new Function();
  func.prototype.save = Record.save;
  func.__proto__ = this;
  return func;
};

Table.prototype.query = function() {
  var q = new Query();
  q._select = this.table_name + ".*";
  q._from = [this];
  q._connectionPool = this.connectionPool;
  return q;
}

Table.prototype.has_many = function(name, other_table, join_key) {
  this.prototype[name] = function() {
    var q = other_table.query().where(other_table.table_name + '.' + join_key + ' = ' + this.id);
    return q;
  };
};

Field = exports.Field = function(field_desc) {
  this.name = field_desc.Field;
  this.type = field_desc.Type;
  this.null = field_desc.NULL === "YES";
  this.default = field_desc.Default;
}

Record =  {};
Record.save = function() {
  var base_class = this.constructor;
  var con = base_class.connectionPool.getConnection();
  var q;
  var obj = this;
  if(this[base_class.primary_key]) {
    q = "update " + base_class.table_name + " set " +
        base_class.fields.map(function(f) { 
                if(obj[f.name]) return f.name + " = '" + obj[f.name] + "'";}).filter(function(o){ return o}).join(", ");
    q += " where " + base_class.primary_key + " = " + this[base_class.primary_key]; 
  }
  else{
  }
  console.log(q);
  con.querySync(q)
}
