Field = exports.Field = function(table, field_desc) {
  this.name = field_desc.Field;
  this.type = field_desc.Type;
  this.null = field_desc.NULL === "YES";
  this.default = field_desc.Default;
  this.table = table;
}

Field.prototype.toSql = function() {
  return (this.table ? this.table.table_name + '.' : '') + this.name;
}
