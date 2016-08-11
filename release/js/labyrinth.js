/**
 An array of rooms
 Each room is an array of tiles
 */

var labyrinth = new Object();

labyrinth.init = function() {
  
  labyrinth.room_tile_width = 8;
  labyrinth.room_tile_height = 8;
  
  // TODO: probably move this to the map class
  // and leave labyrinth as the static lookup world map data
  labyrinth.current_room_x = 0;
  labyrinth.current_room_y = 0;
  
  labyrinth.room_tiles = new Array();
  for (var i=0; i<labyrinth.room_tile_height; i++) {
    labyrinth.room_tiles[i] = new Array();
  }

  // total labyrinth size
  labyrinth.room_span_x = 8;
  labyrinth.room_span_y = 3;
    
  // overall world map
  // TODO: external file
  labyrinth.world_tiles = [
[1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,10,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,10,10,2,2,2,3],
[11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
[11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
[11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,13,10,10,10,0,0,0,0,0,10,10,0,0,0,0,0,0,0,0,0,0,0,0,0,10,11],
[11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,0,0,0,0,0,0,0,0,10,0,0,0,0,0,10,0,0,0,0,0,0,10,0,10,0,10,10,0,0,0,0,0,0,11],
[11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,0,0,0,0,0,0,11,0,10,0,11,11,15,0,0,0,0,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
[11,0,0,0,0,0,0,0,0,0,0,0,10,0,0,0,0,0,0,0,10,0,0,0,0,0,0,0,0,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
[1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,2,3,0,0,0,11],
[1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,10,10,2,2,2,3,1,2,10,10,10,2,2,3,1,2,10,2,2,2,2,3,1,2,10,10,10,2,2,3,1,2,10,2,2,2,2,3,1,2,2,3,0,0,0,11],
[11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3],
[11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,13,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,0,11],
[11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,3,0,11],
[11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,11,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,11,11,15,0,0,0,0,0,0,13,11,11,11,0,0,0,0,0,0,0,0,0,0,0,0,11],
[11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,0,0,0,7,11,11,11,11,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,11],
[11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,11,0,0,0,0,0,0,11],
[1,3,0,0,0,0,1,3,1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,7,7,7,7,2,3,1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3],
[1,3,0,0,0,0,1,3,1,2,2,2,2,2,2,3,1,2,10,10,2,2,2,3,1,2,10,10,2,2,2,3,1,2,2,2,2,2,2,3,1,2,10,10,10,2,2,3,1,2,10,10,10,2,2,3,1,2,2,2,2,2,2,3],
[11,0,0,0,0,0,0,0,0,0,8,8,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
[11,0,0,1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
[11,0,0,0,0,0,0,0,0,0,0,0,11,11,0,11,15,0,0,0,0,0,0,13,11,15,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
[11,0,0,0,0,0,0,0,0,0,0,0,8,8,0,11,11,0,0,0,0,0,0,11,11,11,0,0,0,0,0,13,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11],
[11,11,0,0,0,0,0,0,0,0,0,0,0,0,0,11,11,0,0,0,0,0,0,11,11,11,0,0,0,0,0,11,11,0,0,0,0,11,11,11,11,15,0,0,0,0,0,0,0,0,0,0,0,0,13,11,11,11,0,0,0,0,0,11],
[11,11,0,0,0,0,0,0,0,0,0,0,0,0,0,11,11,0,0,0,0,0,0,11,11,11,0,0,0,0,0,11,11,0,0,0,0,11,11,11,11,11,7,0,0,0,0,0,0,0,0,0,0,7,11,11,11,11,0,0,0,0,0,11],
[1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3,1,7,7,7,7,7,7,3,1,2,7,7,7,7,7,3,1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3]];


  // TODO: way to calculate this?
  // I suspect split rooms can be interpreted different ways, so maybe this
  // should be set by hand anyway?
  labyrinth.minimap_room_tiles = [
    [8,12,12,12,12,12,12,6],
    [10,12,12,12,12,12,12,5],
    [9,12,12,12,12,12,12,4]];

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
}

labyrinth.draw_room = function() {

  for (var i=0; i<8; i++) {
    for (var j=0; j<8; j++) {
	  tileset.draw_tile(labyrinth.room_tiles[j][i], i, j);
    }
  }

}
