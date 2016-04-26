-- subway routes with colour
SELECT
*,
substring((relations::json->0->'reltags'->'colour')::text from 3 for 6)  subway_color
FROM osm_subway_routes_geojson

-- stations

SELECT * FROM osm_subway_stations
WHERE
type_ratp = 'metro'


-- get lines colors
SELECT
distinct on(color)
substring((relations::json->0->'reltags'->'colour')::text from 3 for 6) as subway_color
FROM osm_subway_routes_geojson
