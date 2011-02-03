var rdx = require('rdx')
var cfg = {  adapter: 'mysql-libmysqlclient',
  host: "localhost",
  database: "test",
          };

var cp = new rdx.ConnectionPool(cfg);
var User = new rdx.Model(cp, 'users');
var Collection = new rdx.Model(cp, 'collections');
var Item = new rdx.Model(cp, 'items');

User.toMany('collections', Collection, Collection.fields["user_id"]);

Collection.belongsTo('user', Collection.fields["user_id"], User);
u = User.find("1", false)
u.collections.findOne(false).user.findOne(false).user.findOne(false)

u = User.create({email: "a@b", user_type: 0}, false)
; u.destroySync()

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
