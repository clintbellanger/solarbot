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
[0,1,2,2,2,2,2,3,1,2,3,10,10,1,2,3,1,2,2,2,2,2,2,3,1,2,11,9,11,2,3,11,11,11,1,2,2,2,2,3,0,0,0,0,0,0,0,0,0,18,16,18,18,16,18,19,15,16,16,18,18,0,0,0],
[2,3,6,0,0,0,0,0,5,5,10,9,10,10,5,5,0,5,6,5,0,0,0,0,5,5,5,12,5,5,5,5,5,6,12,0,5,5,0,10,1,2,3,9,1,2,2,3,19,15,15,22,22,0,0,0,0,0,0,17,18,0,0,0],
[10,0,6,0,0,0,0,0,4,4,5,10,9,12,4,4,0,0,6,0,0,0,0,0,0,0,4,0,4,0,0,11,11,11,1,2,2,3,0,1,2,2,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,17,18,0,0],
[10,2,3,0,0,0,0,0,4,4,4,5,5,5,4,4,0,0,6,0,1,11,3,0,0,0,6,0,6,0,1,11,5,11,0,0,5,5,0,11,10,5,5,6,0,0,0,11,16,16,15,0,0,0,0,0,0,0,0,0,13,18,16,18],
[11,5,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,5,6,5,0,0,0,6,0,6,0,0,11,11,11,0,0,4,4,0,11,10,4,4,6,0,0,0,11,19,22,0,0,0,0,0,0,0,0,0,0,22,0,0,18],
[11,4,6,0,0,0,1,10,10,3,0,0,0,0,0,0,0,0,6,0,0,6,0,0,0,4,4,0,11,11,11,11,11,6,0,0,5,4,0,9,9,4,4,6,1,2,2,3,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16],
[11,4,6,0,0,0,0,1,3,5,0,0,0,0,0,0,0,0,6,0,0,6,0,0,0,4,4,7,11,9,5,5,5,6,0,0,4,4,0,11,2,2,2,3,10,12,12,10,19,0,0,0,0,0,0,13,14,15,0,0,0,0,0,17],
[9,1,2,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,3,0,0,1,2,3,1,2,3,9,11,11,11,11,11,6,0,0,4,5,0,1,2,3,0,0,0,0,0,0,13,0,0,0,0,0,0,0,0,0,0,0,0,0,0,15],
[1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,3,0,0,1,2,3,1,2,2,2,2,2,2,3,11,6,0,0,6,0,0,11,15,16,16,18,18,16,18,19,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19],
[10,0,6,0,0,6,5,5,5,6,12,0,0,0,6,0,6,12,6,0,1,3,9,0,0,5,6,0,0,6,8,0,0,6,0,0,6,0,0,11,19,0,0,22,22,0,0,17,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,17],
[10,0,6,0,0,6,4,4,4,6,0,0,0,0,1,2,3,0,6,0,12,6,0,0,0,11,6,0,0,6,0,0,0,6,1,2,3,0,0,11,19,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,13,16,17],
[10,0,1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,3,0,6,0,0,0,12,6,0,0,6,0,0,0,6,5,0,0,0,0,11,16,19,0,0,0,0,0,13,16,0,0,0,21,21,0,0,0,0,0,0,0,0,0,13],
[10,0,0,0,0,0,0,1,2,3,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0,6,0,0,6,0,0,0,6,10,0,0,0,0,11,19,0,0,0,0,0,0,18,19,0,0,0,13,14,14,16,15,0,0,0,0,0,0,18],
[10,11,11,0,0,0,0,6,5,6,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,11,6,0,0,6,11,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,16,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16],
[10,11,11,0,0,0,0,6,4,6,0,0,0,0,0,1,2,2,2,3,0,6,0,0,0,11,7,7,7,7,11,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,21,17,19,0,0,0,0,0,0,0,0,0,0,0,0,0,21,17],
[1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3,5,5,1,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3,13,14,14,16,14,14,14,15,13,14,15,0,0,0,0,0,0,0,0,0,0,0,14,15],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,15,16,18,0,0,0,0,0,0,0,0,0,0,0,18,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,0,0,0,0,0,0,0,0,0,0,0,0,0,17,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,0,0,0,0,0,0,0,0,21,0,0,0,0,16,17],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,0,0,0,0,0,13,14,14,18,0,0,0,0,0,13],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,13,14,16,16,0,0,0,0,0,0,0,0,0,0,16],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18,14,16,0,0,0,0,0,0,0,0,21,17],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18,14,16,15,13,14,14,16,14,14,14,15]];


  // TODO: way to calculate this?
  // I suspect split rooms can be interpreted different ways, so maybe this
  // should be set by hand anyway?
  labyrinth.minimap_room_tiles = [
    [8,12,14,12,6,8,14,6],
    [8,12,13,12,13,4,15,7],
    [0,0,0,0,0,0,9,5]];

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
