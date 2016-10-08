/**
 An array of rooms
 Each room is an array of tiles
 */

var labyrinth = {};

labyrinth.init = function() {
  
  // labyrinth.mapfile; //  tiled.load_map()
  
  labyrinth.room_tile_width = 8;
  labyrinth.room_tile_height = 8;
  
  // rover position info
  labyrinth.spawn_pos = {room_x: 0, room_y: 0, tile_x: 0, tile_y: 0, facing: 0};
  labyrinth.current_room_x = 0;
  labyrinth.current_room_y = 0;
  
  labyrinth.room_tiles = [];
  for (var i=0; i<labyrinth.room_tile_height; i++) {
    labyrinth.room_tiles[i] = [];
  }

  // total labyrinth size
  labyrinth.room_span_x = 0;
  labyrinth.room_span_y = 0;
    
  // overall world map
  labyrinth.world_tiles = [];
  labyrinth.minimap_room_tiles = [];

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

