config = require('./docs/config')

RDX = require('./index').RDX;

cp = new RDX.ConnectionPool(config.cfg)
users = new RDX.Table(cp, 'users');
collections = new RDX.Table(cp, 'collections');

users.has_many('collections', collections, 'user_id')
x = users.query().where('id = 675011 ').execute()[0];
console.log(x)
x.first_name = "S";
x.save()
