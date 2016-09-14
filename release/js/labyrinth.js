/**
 An array of rooms
 Each room is an array of tiles
 */

var labyrinth = new Object();

labyrinth.init = function() {
  
  labyrinth.room_tile_width = 8;
  labyrinth.room_tile_height = 8;
  
  // rover position info
  labyrinth.spawn_pos = {room_x: 0, room_y: 0, screen_x: 0, screen_y: 0};
  labyrinth.current_room_x = 0;
  labyrinth.current_room_y = 0;
  
  labyrinth.room_tiles = [];
  for (var i=0; i<labyrinth.room_tile_height; i++) {
    labyrinth.room_tiles[i] = [];
  }

  // total labyrinth size
  labyrinth.room_span_x = 16;
  labyrinth.room_span_y = 8;
    
  // overall world map
  // TODO: external file
  labyrinth.world_tiles = [
[0,1,2,2,2,2,2,3,1,2,3,10,10,1,2,3,1,2,2,2,2,2,2,3,1,2,11,9,11,2,3,11,11,11,1,2,2,2,2,3,0,0,0,0,0,0,0,0,0,18,16,18,18,16,18,19,15,16,16,18,18,0,0,0],
[2,3,6,0,0,0,0,0,5,5,10,9,10,10,5,5,0,5,6,5,0,0,0,0,5,5,5,12,5,5,5,5,5,6,12,0,5,5,0,10,1,2,3,9,1,2,2,3,19,15,15,22,22,31,31,0,0,0,0,17,18,0,0,0],
[10,0,6,0,0,0,0,0,4,4,5,10,9,12,4,4,0,0,6,0,0,0,0,0,0,0,4,0,4,0,0,11,11,11,1,2,2,3,0,1,2,2,2,3,31,0,0,0,0,0,0,0,0,32,30,0,0,0,0,31,17,18,0,0],
[10,2,3,0,0,0,0,0,4,4,4,5,5,5,4,4,0,0,6,0,1,11,3,0,0,0,6,0,6,0,1,11,5,11,0,0,5,5,0,11,10,29,0,6,32,0,0,11,16,16,15,0,0,0,31,0,0,0,0,30,13,18,16,18],
[11,5,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,5,6,5,0,0,0,6,0,6,0,0,11,11,11,0,0,4,4,0,11,10,5,5,6,0,0,26,11,19,22,30,0,0,0,32,0,0,0,0,32,22,27,30,18],
[11,4,6,0,0,0,1,10,10,3,0,0,0,0,0,0,0,0,6,0,0,6,0,0,0,4,4,0,11,11,11,11,11,6,0,0,5,4,0,9,9,4,4,6,1,2,2,3,19,30,31,0,0,0,0,0,26,0,0,0,0,29,32,16],
[11,4,6,0,0,0,0,1,3,5,0,0,0,0,0,0,0,0,6,0,0,6,0,0,0,4,4,7,11,9,5,5,5,6,0,0,4,4,0,11,2,2,2,3,10,12,12,10,19,31,31,0,0,0,0,13,14,15,0,0,0,0,0,17],
[9,1,2,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,3,0,0,1,2,3,1,2,3,9,11,11,11,11,11,6,0,0,4,5,0,1,2,3,0,0,0,0,0,0,13,30,30,0,0,0,0,32,30,0,0,0,0,0,0,15],
[1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,3,0,0,1,2,3,1,2,2,2,2,2,2,3,11,6,0,0,6,0,0,11,15,16,16,18,18,16,18,19,15,31,31,0,0,0,0,0,32,0,0,0,0,0,0,19],
[10,0,6,0,0,6,5,5,5,6,12,0,0,0,6,0,6,12,6,0,1,3,9,0,0,5,6,0,0,6,8,0,0,6,0,0,6,0,0,11,19,30,0,22,22,0,29,17,19,32,30,0,0,0,0,0,0,0,0,0,0,0,25,17],
[10,0,6,0,0,6,4,4,4,6,0,0,0,0,1,2,3,0,6,0,12,6,0,0,0,11,6,0,0,6,0,0,0,6,1,2,3,0,0,11,19,15,0,0,0,0,0,0,0,0,32,0,0,0,0,0,0,0,0,0,0,13,16,17],
[10,0,1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,3,0,6,0,0,0,12,6,0,0,6,0,0,0,6,5,0,0,0,0,11,16,19,0,0,0,0,0,13,16,0,0,0,21,21,0,26,0,0,0,0,0,0,0,13],
[10,0,0,0,0,0,0,1,2,3,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0,6,0,0,6,0,0,0,6,10,0,0,0,0,11,19,0,0,0,0,0,0,18,19,0,0,0,13,14,14,16,15,0,0,0,0,0,0,18],
[10,11,11,0,0,0,0,6,5,6,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,11,6,0,0,6,11,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,16,19,0,0,0,0,0,31,30,30,0,0,0,0,0,0,16],
[10,11,11,0,0,0,0,6,4,6,0,0,0,0,0,1,2,2,2,3,0,6,0,0,0,11,7,7,7,7,11,0,0,6,0,0,0,0,0,0,0,0,0,25,26,0,21,17,19,26,0,0,0,0,31,31,31,0,0,0,0,0,21,17],
[1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3,5,5,1,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3,19,14,14,16,14,14,14,15,13,14,15,0,0,0,30,30,30,0,0,0,0,0,14,15],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,15,16,18,0,0,0,30,31,32,0,0,0,0,0,18,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,13,16,14,15,0,0,0,19,30,0,0,0,0,32,30,0,0,0,0,0,0,17,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,17,32,29,16,18,18,17,19,14,14,15,0,0,0,30,0,21,0,0,0,0,16,17],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,0,0,0,0,0,0,0,0,31,17,19,0,0,13,14,14,18,0,0,0,0,0,13],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,0,0,0,25,0,26,0,0,32,20,20,0,0,0,0,0,0,0,0,0,0,0,18],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,15,19,16,15,14,14,13,16,14,13,14,16,16,25,0,0,0,0,0,0,0,0,0,16],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18,14,16,0,0,0,0,27,0,28,25,21,17],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18,14,16,15,13,14,14,16,14,14,14,15]];


  // TODO: way to calculate this?
  // I suspect split rooms can be interpreted different ways, so maybe this
  // should be set by hand anyway?
  labyrinth.minimap_room_tiles = [
    [8,12,14,12,6,8,14,6],
    [8,12,13,12,13,12,15,7],
    [0,0,0,0,0,8,13,5]];
    
  labyrinth.load_room(labyrinth.current_room_x, labyrinth.current_room_y);

}

labyrinth.get_room_tile = function(room_x, room_y) {

  // note x,y swap because of text edit array
  return labyrinth.minimap_room_tiles[room_y][room_x];
}

labyrinth.valid_room = function(room_x, room_y) {

  // within map bounds?
  if (room_x >= 0 && room_y >= 0 &&
      room_x < labyrinth.room_span_x &&
      room_y < labyrinth.room_span_y) {
      return true;      
  };
  return false;
}

labyrinth.get_tile = function(grid_x, grid_y) {

  // out of bounds counts as tile 0 (no tile)
  if (grid_x < 0 || grid_y < 0 || grid_x >= labyrinth.room_tile_width || grid_y >= labyrinth.room_tile_height) return 0;

  return labyrinth.room_tiles[grid_y][grid_x]; 
}

labyrinth.set_tile = function(grid_x, grid_y, tile_id) {
  labyrinth.room_tiles[grid_y][grid_x] = tile_id;
}

labyrinth.get_tile_by_pixel = function(pixel_x, pixel_y) {
  return labyrinth.get_tile(Math.floor(pixel_x), Math.floor(pixel_y));
}

labyrinth.load_room = function(room_x, room_y) {

  labyrinth.current_room_x = room_x;
  labyrinth.current_room_y = room_y;
  
   for (var i=0; i<8; i++) {
     for (var j=0; j<8; j++) {
         labyrinth.room_tiles[j][i] = labyrinth.world_tiles[room_y * labyrinth.room_tile_height + j][room_x * labyrinth.room_tile_width + i];
       }
   }
   
   pickups.load_room(room_x, room_y);
   bots.load_room(room_x, room_y);
   messages.clear_message();
}

labyrinth.draw_room = function() {

  for (var i=0; i<8; i++) {
    for (var j=0; j<8; j++) {
      tileset.draw_tile(labyrinth.room_tiles[j][i], i, j);
    }
  }

}

/** Below functions specific to Tiled js maps **/

labyrinth.convert_global_position = function(pixel_x, pixel_y) {  
  var world_tile_x, world_tile_y;
  var map_pos = {};
  world_tile_x = bot_data[i].x /  tileset.tile_size;
  world_tile_y = bot_data[i].y /  tileset.tile_size;
  map_pos.room_x = Math.floor(world_tile_x / labyrinth.room_tile_width);
  map_pos.room_y = Math.floor(world_tile_y / labyrinth.room_tile_height);
  map_pos.tile_x = world_tile_x % labyrinth.room_tile_width;
  map_pos.tile_y = world_tile_y % labyrinth.room_tile_height;
  return map_pos;
}

// find layer id by name in javascript map object
labyrinth.tiled_layer_lookup = function(map_obj, layer_name) {
  for (var i=0; i < map_obj.layers.length; i++) {
    if (layer_name == map_obj.layers[i].name) return i;
  }
  console.log("Error: map is missing a required layer named " + layer_name);
}

// similar to above but for tilesets
labyrinth.tiled_tileset_lookup = function(map_obj, tileset_name) {
  for (var i=0; i < map_obj.tilesets.length; i++) {
    if (tileset_name == map_obj.tilesets[i].name) return i;
  }
  console.log("Error: map is missing a required tileset named " + tileset_name);
}

labyrinth.tiled_load_tiles = function(map_obj) {

  // reinit 2d map array
  labyrinth.world_tiles = [];
  for (var rows=0; rows<map_obj.height; rows++) {
    labyrinth.world_tiles[rows] = []; 
  }
    
  // load background tiles  
  var tile_layer = labyrinth.tiled_layer_lookup(map_obj, "tiles");
  var tile_data = map_obj.layers[tile_layer].data;
  
  for (var j=0; j<map_obj.height; j++) {
    for (var i=0; i<map_obj.width; i++) {
      labyrinth.world_tiles[j][i] = tile_data[j * map_obj.width + i]; // WARN: note [j][i]
    }
  }

}


labyrinth.tiled_load_pickups = function(map_obj) {

  var items_tileset_id = labyrinth.tiled_tileset_lookup(map_obj, "items");
  var items_firstgid = map_obj.tilesets[items_tileset_id].firstgid;
  
  var item_layer = labyrinth.tiled_layer_lookup(map_obj, "items");
  var item_data = map_obj.layers[item_layer].objects;  
  var item_type;
  var map_pos;
  
  pickups.clear_all();
  
  for (var i=0; i < item_data.length; i++) {
  
    item_type = item_data[i].gid - items_firstgid; // assumes item types 'enum' matches tile order
    
    map_pos = labyrinth.convert_global_position(item_data[i].x, item_data[i].y);    
    pickups.add(item_type, map_pos.room_x, map_pos.room_y, map_pos.tile_x, map_pos.tile_y);    
    
  }
}

labyrinth.tiled_load_bots = function(map_obj) {
  
  var bots_tileset_id = labyrinth.tiled_tileset_lookup(map_obj, "bots");
  var bots_firstgid = map_obj.tilesets[bots_tileset_id].firstgid;
  
  var bot_layer = labyrinth.tiled_layer_lookup(map_obj, "bots");
  var bot_data = map_obj.layers[bot_layer].objects;
  var bot_gid, bot_type, facing;
  var map_pos;
  
  for (var i=0; i < bot_data.length; i++) {
  
    bot_gid = bot_data[i].gid;
    // convert to bot type and facing
    
    map_pos = labyrinth.convert_global_position(bot_data[i].x, bot_data[i].y);  
    
    
  }
  
}

labyrinth.tiled_load_map = function(map_name) {
  var map_obj = TileMaps[map_name];
  
  labyrinth.room_span_x = map_obj.width / labyrinth.room_tile_width;
  labyrinth.room_span_y = map_obj.height / labyrinth.room_tile_height;
  
  labyrinth.tiled_load_tiles(map_obj);
  labyrinth.tiled_load_pickups(map_obj);
  
    
}
