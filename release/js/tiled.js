/**
 Handle Tiled style js files
 */
var tiled = {};

// converts Tiled's position system to the one used by our labyrinth
tiled.convert_global_position = function(pixel_x, pixel_y) {  
  var world_tile_x, world_tile_y;
  var map_pos = {};
  world_tile_x = pixel_x /  tileset.tile_size;
  world_tile_y = (pixel_y - tileset.tile_size) /  tileset.tile_size; // Tiled object origin is bottom left, we want top left
  map_pos.room_x = Math.floor(world_tile_x / labyrinth.room_tile_width);
  map_pos.room_y = Math.floor(world_tile_y / labyrinth.room_tile_height);
  map_pos.tile_x = world_tile_x % labyrinth.room_tile_width;
  map_pos.tile_y = world_tile_y % labyrinth.room_tile_height;
  return map_pos;
}

// find layer id by name in javascript map object
tiled.layer_lookup = function(map_obj, layer_name) {
  for (var i=0; i < map_obj.layers.length; i++) {
    if (layer_name == map_obj.layers[i].name) return i;
  }
  console.log("Error: map is missing a required layer named " + layer_name);
}

// similar to above but for tilesets
tiled.tileset_lookup = function(map_obj, tileset_name) {
  for (var i=0; i < map_obj.tilesets.length; i++) {
    if (tileset_name == map_obj.tilesets[i].name) return i;
  }
  console.log("Error: map is missing a required tileset named " + tileset_name);
}

tiled.load_tiles = function(map_obj) {

  // reinit 2d map array
  labyrinth.world_tiles = [];
  for (var rows=0; rows<map_obj.height; rows++) {
    labyrinth.world_tiles[rows] = []; 
  }
    
  // load background tiles  
  var tile_layer = tiled.layer_lookup(map_obj, "tiles");
  var tile_data = map_obj.layers[tile_layer].data;
  
  for (var j=0; j<map_obj.height; j++) {
    for (var i=0; i<map_obj.width; i++) {
      labyrinth.world_tiles[j][i] = tile_data[j * map_obj.width + i]; // WARN: note [j][i]
    }
  }

}


tiled.load_pickups = function(map_obj) {

  var items_tileset_id = tiled.tileset_lookup(map_obj, "items");
  var items_firstgid = map_obj.tilesets[items_tileset_id].firstgid;
  
  var item_layer = tiled.layer_lookup(map_obj, "items");
  var item_data = map_obj.layers[item_layer].objects;  
  var item_type;
  var map_pos;
  
  pickups.clear_all();
  
  for (var i=0; i < item_data.length; i++) {
  
    item_type = item_data[i].gid - items_firstgid; // assumes item types 'enum' matches tile order
    
    map_pos = tiled.convert_global_position(item_data[i].x, item_data[i].y);    
    pickups.add(item_type, map_pos.room_x, map_pos.room_y, map_pos.tile_x, map_pos.tile_y);    
    
  }
}

tiled.load_bots = function(map_obj) {
  
  var bots_tileset_id = tiled.tileset_lookup(map_obj, "bots");
  var bots_firstgid = map_obj.tilesets[bots_tileset_id].firstgid;
  
  var bot_layer = tiled.layer_lookup(map_obj, "bots");
  var bot_data = map_obj.layers[bot_layer].objects;
  var bot_gid, bot_type, facing;
  var map_pos;
    
  for (var i=0; i < bot_data.length; i++) {
    
    // WARN: this code block is overly specific to solarbot.
    // taking the gids listed in the Tiled map and converting
    // to bot type and facing direction.
    // TODO: Possibly better done with Tiled tile properties on those bots.    
    bot_gid = bot_data[i].gid - bots_firstgid;

    // convert to bot type and facing
    // look at the tiled bots.png tileset to see what this is doing    
    bot_type = Math.floor(bot_gid/2); // see bots.types. Rover = 0, etc.
    bot_facing = (bot_gid%2); // able to spawn state 0 and state 1 of bots e.g. LEFT and RIGHT
    
    map_pos = tiled.convert_global_position(bot_data[i].x, bot_data[i].y);  
    
    if (bot_type == bots.types.ROVER) {
      // set new player spawn point 
      labyrinth.spawn_pos = {room_x: map_pos.room_x, room_y: map_pos.room_y, tile_x: map_pos.tile_x, tile_y: map_pos.tile_y, facing: bot_facing};
    }
    else {
      bots.add_spawn(bot_type, map_pos.room_x, map_pos.room_y, map_pos.tile_x, map_pos.tile_y, bot_facing);
    }
  }
  
}

tiled.load_map = function(map_name) {
  var map_obj = TileMaps[map_name];
  
  labyrinth.room_span_x = map_obj.width / labyrinth.room_tile_width;
  labyrinth.room_span_y = map_obj.height / labyrinth.room_tile_height;
  minimap.reset_minimap(labyrinth.room_span_x, labyrinth.room_span_y);
  
  tiled.load_tiles(map_obj);
  tiled.load_pickups(map_obj);
  tiled.load_bots(map_obj);
  
  labyrinth.load_room(labyrinth.spawn_pos.room_x, labyrinth.spawn_pos.room_y);
  
}
