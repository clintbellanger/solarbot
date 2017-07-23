(function(name,data){
 if(typeof onTileMapLoaded === 'undefined') {
  if(typeof TileMaps === 'undefined') TileMaps = {};
  TileMaps[name] = data;
 } else {
  onTileMapLoaded(name,data);
 }
 if(typeof module === 'object' && module && module.exports) {
  module.exports = data;
 }})("lights_test",
{ "height":16,
 "layers":[
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 10, 3, 3, 3, 3, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 3, 3, 3, 3, 3, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 4, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":16,
         "name":"Tile Layer 1",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":16,
         "x":0,
         "y":0
        }],
 "nextobjectid":1,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tiledversion":"1.0.2",
 "tileheight":8,
 "tilesets":[
        {
         "firstgid":1,
         "source":"..\/..\/art_src\/maps\/lights.tsx"
        }],
 "tilewidth":8,
 "type":"map",
 "version":1,
 "width":16
});