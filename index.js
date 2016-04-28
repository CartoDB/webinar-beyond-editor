/* eslint quotes: 0 */
;(function() {
  function main() {
    cartodb.createVis('map', 'https://erik-webinar.cartodb.com/api/v2/viz/59cf5fba-0bb5-11e6-8c77-0e31c9be1b51/viz.json', {

    })
    .done(function(vis, layers) {
      // layer 0 is the base layer, layer 1 is cartodb layer
      // setInteraction is disabled by default
      layers[1].setInteraction(true);
      layers[1].on('featureOver', function(e, latlng, pos, data) {

      });
      // you can get the native map to work with it
      var map = vis.getNativeMap();

      // check out the actual viz.json file!
      //layers[0]: positron basemap
      //layers[1]: data layers
      //layers[2]: positron basemap (labels)
      var datavizLayers = layers[1];

      // in the data layer, we have 2 sublayers:
      var routes = window.routes = datavizLayers.getSubLayer(0);
      var stations = datavizLayers.getSubLayer(1);
      // console.log(stations)
      // stations.hide()
      stations.setCartoCSS('#osm_subway_stations{marker-fill:white}');

      var routesCSS = window.routesCSS = '#osm_subway_routes_geojson{line-width: 10; line-opacity: 1;}';
      // routes.setCartoCSS(routesCSS);

      // a standalone SQL client is embedded into cartodb.js, allowing us to perform queries 'outside of the map'
      var sql = new cartodb.SQL({user: 'erik-webinar'});

      // fetch unique metro line colors in the dataset
      sql.execute("SELECT      distinct on(subway_color)      substring((relations::json->0->'reltags'->'colour')::text from 3 for 6) as subway_color      FROM osm_subway_routes_geojson")
        .done(function(colorsData) {
          // console.log(colorsData);
          colorsData.rows.forEach(function(row) {
            // apply each color using a selector with the actual color value
            window.routesCSS += "#osm_subway_routes_geojson[subway_color='"+row.subway_color+"'] {line-color: #"+ row.subway_color +";}";
          })
          window.routes.setCartoCSS(window.routesCSS);
        })


      // console.log(stations.getSQL())
      // stations.setSQL("SELECT * FROM osm_subway_stations WHERE type_ratp = 'metro'")
      // stations.setSQL("SELECT * FROM osm_subway_stations WHERE type_ratp = 'metro' AND wheelchair = 'no'")

      //grab that SQL from the HTML file
      var sqlTemplate = document.getElementById('js-stations-template').innerHTML;

      // turn it into an Underscore template so that we can inject variables
      var compiledSQLTemplate = cartodb._.template(sqlTemplate);

      // var finalSQL = compiledSQLTemplate({wheelchair: 'yes'});

      // ...which also allows us to use conditionals, for example to toggle between 2 visualisations
      var finalSQL = compiledSQLTemplate({showTraffic: true});
      stations.setSQL(finalSQL);

      console.log(finalSQL);
      stations.setSQL(finalSQL);

      // use that computed circle_size column to show # of passengers per year on each staion circle
      stations.setCartoCSS('#osm_subway_stations{marker-fill:white; marker-width: [circle_size]}');

      // mark the sublayer as interactive, then select which column values are returned in callbacks
      stations.setInteraction(true)
      stations.setInteractivity('cartodb_id,name,trafic')

      // add listeners, see http://docs.cartodb.com/cartodb-platform/cartodb-js/events/
      stations.on('featureOver', function(e, latlng, pos, data, subLayerIndex) {
        console.log( data);
        document.getElementById('info').innerHTML = 'name: ' + data.name + '<br>traffic (2014): '+ data.trafic;
      });

    })
    .error(function(err) {
      console.log(err);
    });
  }
  window.onload = main;
})();
