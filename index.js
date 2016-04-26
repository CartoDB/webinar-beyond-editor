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

      var datavizLayers = layers[1];
      var routes = window.routes = datavizLayers.getSubLayer(0);
      var stations = datavizLayers.getSubLayer(1);
      // console.log(stations)
      // stations.hide()
      stations.setCartoCSS('#osm_subway_stations{marker-fill:white}');

      var routesCSS = window.routesCSS = '#osm_subway_routes_geojson{line-width: 10; line-opacity: 1;}';
      // routes.setCartoCSS(routesCSS);

      // var sql = new cartodb.SQL({user: 'nerikcarto'});
      var sql = new cartodb.SQL({user: 'erik-webinar'});
      sql.execute("SELECT      distinct on(subway_color)      substring((relations::json->0->'reltags'->'colour')::text from 3 for 6) as subway_color      FROM osm_subway_routes_geojson")
        .done(function(colorsData) {
          // console.log(colorsData);
          colorsData.rows.forEach(function(row) {
            window.routesCSS += "#osm_subway_routes_geojson[subway_color='"+row.subway_color+"'] {line-color: #"+ row.subway_color +";}";
          })
          window.routes.setCartoCSS(window.routesCSS);
        })


      // console.log(stations.getSQL())
      // stations.setSQL("SELECT * FROM osm_subway_stations WHERE type_ratp = 'metro'")
      // stations.setSQL("SELECT * FROM osm_subway_stations WHERE type_ratp = 'metro' AND wheelchair = 'no'")

      var sqlTemplate = document.getElementById('js-stations-template').innerHTML;

      var compiledSQLTemplate = cartodb._.template(sqlTemplate);

      // var finalSQL = compiledSQLTemplate({wheelchair: 'yes'});

      var finalSQL = compiledSQLTemplate({showTraffic: true});
      stations.setSQL(finalSQL);

      console.log(finalSQL);
      stations.setSQL(finalSQL);

      stations.setCartoCSS('#osm_subway_stations{marker-fill:white; marker-width: [circle_size]}');

      stations.setInteraction(true)
      stations.setInteractivity('cartodb_id,name,trafic')

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
