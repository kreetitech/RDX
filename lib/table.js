exports.Table = function(connection_pool, table_name) {
  this.table_name = table_name;
  this.connection_pool = connection_pool;
  this.primary_key = 'id';

  this.fields = this.connection_pool.getConnection().query('show fields from ' + table_name).fetchAll().map(function(f){ return new Field(f);});

  this.relationships = [];
};

Table.prototype.has_one = function(name, other_table, index_field, other_key) {
  var 
}

exports.Field = function(field_desc) {
  this.name = field_desc.Field;
  this.type = field_desc.Type;
  this.null = field_desc.NULL === "YES";
  this.default = field_desc.Default;
}
