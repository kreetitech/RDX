__dirname = '.'
require.paths.push(__dirname);
//require.paths.push(__dirname + '/..');
//require.paths.push(__dirname + '/../deps');
require.paths.push(__dirname + '/deps');

var RDX = require('index').RDX;
var cfg = require("tests/fixtures/config").cfg;

var ConnectionPool = RDX.ConnectionPool;
var Table = RDX.Table;
var Query = RDX.Query;
var ToMany = RDX.ToMany;
var BelongsTo = RDX.BelongsTo;

var cp = new ConnectionPool(cfg);
var User = new Table(cp, 'users');
var Collection = new Table(cp, 'collections');
var Item = new Table(cp, 'items');

User.collections = User.prototype.collections = new ToMany(User, 'id', Collection, 'user_id');

Collection.items  = new ToMany(Collection, 'id', Item, 'collection_id');

Collection.prototype.user = Collection.user = new BelongsTo(Collection, 'user_id', User, 'id');

q = User.query().where('id = 675011 ');

x = q.executeSync()[0];

/* q = x.collections().query();
console.log(q.toSql());

q = User.collections().query();
console.log(q.toSql());

c = q.take(1).executeSync()[0];
console.log(c instanceof Collection);

console.log(c.user().query().toSql());

q = Collection.user().query();
console.log(q.toSql());

q = Collection.items().query();
console.log(q.toSql());


q = x.collections().items().query();
console.log(q.toSql());

*/