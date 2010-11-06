var Record = exports.Record =  {
  newRecord: true
};
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
