Field = exports.Field = function(field_desc) {
  this.name = field_desc.Field;
  this.type = field_desc.Type;
  this.null = field_desc.NULL === "YES";
  this.default = field_desc.Default;
}
