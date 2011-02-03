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
Collection.toMany('items', Item, Item.fields['collection_id']);
Item.belongsTo('collections',Item.fields["collection_id"], Collection);

u = User.create({email: "a@b", user_type: 0}, false)
u.destroySync()

u = User.find("1", false)
u.collections.findOne(false).user.findOne(false)
u = User.where('id = 1').findOne(false);

User.find("1", function(err, res) { console.log(res); });

u.collections.where("name like '%book'").all(function(err, res) { console.log(res); })
