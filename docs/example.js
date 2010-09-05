require.paths.push(__dirname);
require.paths.push(__dirname + '/..');
require.paths.push(__dirname + '/../deps');

var RDX = require('index').RDX;
var cfg = require("tests/fixtures/config").cfg;

var ConnectionPool = RDX.ConnectionPool;
var Table = RDX.Table;
var Query = RDX.Query;
var ToMany = RDX.ToMany;
var BelongsTo = RDX.BelongsTo;

var cp = new ConnectionPool(cfg);
var users = new Table(cp, 'users');
var collections = new Table(cp, 'collections');
var items = new Table(cp, 'items');

users.collections = users.prototype.collections = new ToMany(users, 'id', collections, 'user_id');

collections.items  = new ToMany(collections, 'id', items, 'collection_id');

collections.prototype.user = collections.user = new BelongsTo(collections, 'user_id', users, 'id');

q = users.query().where('id = 675011 ');

x = q.executeSync()[0];

q = x.collections().query();
console.log(q.toSql());

q = users.collections().query();
console.log(q.toSql());

c = q.take(1).executeSync()[0];
console.log(c instanceof collections);

console.log(c.user().query().toSql());

q = collections.user().query();
console.log(q.toSql());

q = collections.items().query();
console.log(q.toSql());


q = x.collections().items().query();
console.log(q.toSql());

