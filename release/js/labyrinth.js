/**
 An array of rooms
 Each room is an array of tiles
 */

var labyrinth = new Object();

labyrinth.init = function() {
  
  labyrinth.room_tile_width = 8;
  labyrinth.room_tile_height = 8;
  
  labyrinth.current_room_x = 0;
  labyrinth.current_room_y = 0;
  
  labyrinth.room_tiles = new Array();
  for (var i=0; i<labyrinth.room_tile_height; i++) {
    labyrinth.room_tiles[i] = new Array();
  }

  // overall world map
  // TODO: external file
  labyrinth.world_tiles = [
[0,1,2,2,2,2,2,3,1,2,3,10,10,1,2,3,1,2,2,2,2,2,2,3,1,2,11,9,11,2,3,11,11,11,1,2,2,2,2,3],
[2,3,6,0,0,0,0,0,5,5,10,9,10,10,5,5,0,5,6,5,0,0,0,0,5,5,5,12,5,5,5,5,5,6,12,0,5,5,0,10],
[10,0,6,0,0,0,0,0,4,4,5,10,9,12,4,4,0,0,6,0,0,0,0,0,0,0,4,0,4,0,0,11,11,11,1,2,2,3,0,1],
[10,2,3,0,0,0,0,0,4,4,4,4,5,5,4,4,0,0,6,0,1,11,3,0,0,0,6,0,6,0,1,11,5,11,0,0,5,5,0,11],
[11,5,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,5,6,5,0,0,0,6,0,6,0,0,11,11,11,0,0,4,4,0,11],
[11,4,6,0,0,0,1,10,10,3,0,0,0,0,0,0,0,0,6,0,0,6,0,0,0,4,4,0,11,11,11,11,11,6,0,0,5,4,0,9],
[11,4,6,0,0,0,0,1,3,5,0,0,0,0,0,0,0,0,6,0,0,6,0,0,0,4,4,7,11,9,5,5,5,6,0,0,4,4,0,11],
[9,1,2,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,3,0,0,1,2,3,1,2,3,9,11,11,11,11,11,6,0,0,4,5,0,11],
[1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,3,0,0,1,2,3,1,2,2,2,2,2,2,3,11,6,0,0,6,0,0,11],
[10,0,6,0,0,6,5,5,5,6,12,0,0,0,6,0,6,12,6,0,1,3,9,0,0,5,6,0,0,6,8,0,0,6,0,0,6,0,0,11],
[10,0,6,0,0,6,4,4,4,6,0,0,0,0,1,2,3,0,6,0,12,6,0,0,0,11,6,0,0,6,0,0,0,6,1,2,3,0,0,11],
[10,0,1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,3,0,6,0,0,0,12,6,0,0,6,0,0,0,6,5,0,0,0,0,11],
[10,0,6,0,0,0,0,1,2,3,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0,6,0,0,6,0,0,0,6,10,0,0,0,0,11],
[10,11,11,0,0,0,0,6,5,6,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,11,6,0,0,6,11,0,0,6,0,0,0,0,0,11],
[10,11,11,0,0,0,0,6,4,6,0,0,0,0,0,1,2,2,2,3,0,6,0,0,0,11,7,7,7,7,11,0,0,6,0,0,0,0,0,11],
[1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3,5,5,1,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3]];



  labyrinth.load_room(labyrinth.current_room_x, labyrinth.current_room_y);

}

labyrinth.get_tile = function(grid_x, grid_y) {
    
  return labyrinth.room_tiles[grid_y][grid_x]; 
}

labyrinth.load_room = function(room_x, room_y) {

  labyrinth.current_room_x = room_x;
  labyrinth.current_room_y = room_y;
  
   for (var i=0; i<8; i++) {
     for (var j=0; j<8; j++) {
	   labyrinth.room_tiles[j][i] = labyrinth.world_tiles[room_y * labyrinth.room_tile_height + j][room_x * labyrinth.room_tile_width + i];
	 }
   }
}

labyrinth.draw_room = function() {

  for (var i=0; i<8; i++) {
    for (var j=0; j<8; j++) {
	  tileset.draw_tile(labyrinth.room_tiles[j][i], i, j);
    }
  }

}
