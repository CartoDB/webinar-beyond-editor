var CartoDB = require('cartodb');

// console.log(CartoDB)

var importer = new CartoDB.Import({
  user:'erik-webinar',
  api_key:'252fdac93134c48a5b0bf380f9a217e004b94de7'
});

importer.file('data/metro_traffic.csv', {})
  .done(function(table_name) {
    console.log(table_name)
  })
