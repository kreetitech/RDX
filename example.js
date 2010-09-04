
users.has_many('collections', collections, 'user_id')
x = users.query().where('id = 675011 ').executeSync()[0];
console.log(x)
x.first_name = "S";
x.save()


