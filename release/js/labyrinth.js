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
[0,1,2,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,9],
[2,3,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10],
[10,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10],
[10,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10],
[10,5,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10],
[10,4,6,0,0,0,1,10,10,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10],
[10,4,6,0,0,0,0,1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10],
[9,1,2,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,3,0,0,1,2,3,1,2,2,2,2,2,2,9],
[1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,3,0,0,1,2,3,1,2,2,2,2,2,2,3],
[10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,3,0,0,0,0,0,0,0,0,0,10],
[10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10],
[10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,3,0,0,0,0,0,0,0,0,0,0,0,10],
[10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10],
[10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,0,0,0,0,0,0,10],
[10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,0,0,0,0,0,0,10],
[1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3]];


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
