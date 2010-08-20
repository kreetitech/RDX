exports.Table = function(connection_pool, table_name) {
  this.table_name = table_name;
  this.connection_pool = connection_pool;
  this.fields = this.connection_pool.getConnection().query('show fields from ' + table_name).fetchAll().map(function(f){ return new Field(f);});
}

exports.Field = function(field_desc) {
  this.name = field_desc.Field;
  this.type = field_desc.Type;
  this.null = field_desc.NULL === "YES";
  this.default = field_desc.Default;
}
