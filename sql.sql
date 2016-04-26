-- subway routes with colour
SELECT
*,
substring((relations::json->0->'reltags'->'colour')::text from 3 for 6)  subway_color
FROM osm_subway_routes_geojson
