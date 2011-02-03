var User = require('./index').User;
var Collection = require('./index').Collection;

User.toMany('collections', Collection, Collection.fields["user_id"]);
