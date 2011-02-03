var Events = require('events');

var Record =  function() {
  this.newRecord = true;
  this.destroyed = false;
};
module.exports = Record;

Record.prototype = Object.create(Events.EventEmitter.prototype);

Record.prototype.save = function(callback) {
  var base_class = this.constructor;
  var connection = base_class.connectionPool.getConnection();
  var me = this, res;
  if(this.newRecord) {
    var fields = [], values = [];
    base_class.fields.forEach(function(f){ 
	   if(!(me[f.name] === undefined)) {fields.push(f.toSql()); 
 		    values.push(typeof(me[f.name]) === 'string' ? ("'" + connection.escapeSync(me[f.name]) + "'") : me[f.name]);}});

    var sql = "insert into " + base_class.tableName + " (" + fields.join(",") + ") values (" + values.join(",") + ")";
    if(callback === false) {
      base_class.emit('beforeCreate', this);
      res = connection.querySync(sql);
      var id = connection.lastInsertIdSync();
      if(id != 0) { this[base_class.primaryKey.name] = id; res = true; this.newRecord = false;}
      base_class.emit('afterCreate', this);
    } else {
      base_class.emit('beforeCreate');
      res = connection.query(sql, function (err, res) {        
        if(res && res.insertId != 0) { me[base_class.primaryKey.name] = res.insertId; res = true; this.newRecord = false;}
        if(typeof(callback) === 'function') {callback.call(me, err, res);}});
        base_class.emit('afterCreate', me);
    }
  }
  else{
    var sql = "update " + base_class.tableName + " set " + base_class.fields.map(function(f) {
        if(me[f.name]) return f.name + " = '" + me[f.name] + "'";}).filter(function(o){return o}).join(", ");
    sql += " where " + base_class.primaryKey.toSql() + " = " + this[base_class.primaryKey.name];
    if(callback === false) {
      base_class.emit('beforeUpdate', this);
      res = connection.querySync(sql);
      base_class.emit('afterUpdate', this);
    } else {
      base_class.emit('beforeUpdate', this);
      connection.query(sql, callback);
      base_class.emit('afterUpdate', this);
    }
  }
  return res;
}

Record.prototype.updateAttribute = function(field, value, callback) {
  var res = false;
  if(!this.newRecord) {
    var base_class = this.constructor;
    var connection = base_class.connectionPool.getConnection();
    if(typeof(field) === 'string') {field = base_class.fields[field];} 
    if(!field) { throw new Error("unknown field"); }
    if(typeof(value) === 'string') {value = connection.escapeSync(value); }
    this[field.name] = value;
    var sql = "update " + base_class.tableName + " set " + field.toSql() + " = " + (typeof(value) === 'string' ? ("'" + string + "'") : value) +
	     " where " + base_class.primaryKey.toSql() + " = " + this[base_class.primaryKey.name];
    base_class.emit('beforeUpdate', this);
    res = (callback === false ? connection.querySync(sql) : connection.query(sql, callback));
    base_class.emit('afterUpdate', this);
  }
  return res;
}

Record.prototype.destroy = function(callback) {
  var base_class = this.constructor;
  var connection = base_class.connectionPool.getConnection();
  var me = this;
  if(!this.newRecord && !this.destroyed) {
    var sql = "delete from " + base_class.tableName + " where " + base_class.primaryKey.toSql() + " = " + this[base_class.primaryKey.name];
    base_class.emit('beforeDestroy', this);
    if(callback === false) {
      this.destroyed = connection.querySync(sql);
      if(this.destroyed) { base_class.emit('afterDestroy', this);}
      return this.destroyed;
    } else {
      connection.query(sql, function(err, res){ 
          me.destroyed = res; 
          if(typeof(callback) === 'function') {callback.call(me, err, res);}
          if(me.destroyed) { base_class.emit('afterDestroy', me);}
      });
    }
  }
}

Record.prototype.toString = function() {
  var base_class = this.constructor;
  var me = this;
  return '<Record:{' + base_class.tableName + '}(' + base_class.fields.map(function(f){
      return f.name + ': ' + (me[f.name] === undefined ? null : me[f.name]);}).join(", ") + ')>';
}
