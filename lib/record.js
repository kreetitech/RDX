var Record = exports.Record =  {
  newRecord: true,
  destroyed: false
};

Record.saveSync = function() {
  var base_class = this.constructor;
  var connection = base_class.connectionPool.getConnection();
  var res;
  var me = this;
  if(this.newRecord) {
    var fields = [], values = [];
    base_class.fields.forEach(function(f){ 
	if(!(me[f.name] === undefined)) {fields.push(f.toSql()); 
		 values.push(typeof(me[f.name]) === 'string' ? ("'" + connection.escapeSync(me[f.name]) + "'") : me[f.name]);}});

    var sql = "insert into " + base_class.tableName + " (" + fields.join(",") + ") values (" + values.join(",") + ")";
    res = connection.querySync(sql);
    var id = connection.lastInsertIdSync();
    if(id != 0) { this[base_class.primaryKey.name] = id; res = true; this.newRecord = false;}
  }
  else{
    var sql = "update " + base_class.tableName + " set " + base_class.fields.map(function(f) {
        if(me[f.name]) return f.name + " = '" + me[f.name] + "'";}).filter(function(o){return o}).join(", ");
    sql += " where " + base_class.primaryKey.toSql() + " = " + this[base_class.primaryKey.name];
    res = connection.querySync(sql);
  }
  return res;
}

Record.updateAttribute = function(field, value, callback) {
  if(!this.newRecord) {
    var base_class = this.constructor;
    var connection = base_class.connectionPool.getConnection();
    if(typeof(field) === 'string') {field = base_class.fields[field];} 
    if(!field) { throw new Error("unknown field"); }
    if(typeof(value) === 'string') {value = connection.escapeSync(value); }
    this[field.name] = value;
    var sql = "update " + base_class.tableName + " set " + field.toSql() + " = " + (typeof(value) === 'string' ? ("'" + string + "'") : value) +
	  " where " + base_class.primaryKey.toSql() + " = " + this[base_class.primaryKey.name];
    return callback ? connection.query(sql, callback) : connection.querySync(sql);
  }
  return false;
}

Record.destroy = function(callback) {
  var base_class = this.constructor;
  var connection = base_class.connectionPool.getConnection();
  var me = this;
  if(!this.newRecord && !this.destroyed) {
    var sql = "delete from " + base_class.tableName + " where " + base_class.primaryKey.toSql() + " = " + this[base_class.primaryKey.name];
    if(callback) {
      return connection.query(sql, callback);
    } else {
      this.destroyed = connection.querySync(sql);
    }
  }
  return this.destroyed;
}

Record.toString = function() {
  var base_class = this.constructor;
  var me = this;
  return '<Record:{' + base_class.tableName + '}(' + base_class.fields.map(function(f){
      return f.name + ': ' + (me[f.name] === undefined ? null : me[f.name]);}).join(", ") + ')>';
}