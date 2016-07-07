/**
 An array of rooms
 Each room is an array of tiles
 */

var labyrinth = new Object();

labyrinth.init = function() {
  
  labyrinth.room_tile_width = 8;
  labyrinth.room_tile_height = 8;
  
  labyrinth.room_tiles = [
[0,0,0,0,0,6,4,4],
[0,0,0,0,0,6,5,4],
[0,1,2,3,0,6,4,4],
[0,0,8,0,0,6,4,4],
[3,0,0,0,0,6,4,1],
[3,0,1,2,2,3,4,1],
[3,7,5,5,5,6,4,1],
[2,2,3,1,2,3,1,2]];

}

labyrinth.get_tile = function(grid_x, grid_y) {
    
  return labyrinth.room_tiles[grid_y][grid_x]; 
}

labyrinth.draw_room = function() {

  for (var i=0; i<8; i++) {
    for (var j=0; j<8; j++) {
	  tileset.draw_tile(labyrinth.room_tiles[j][i], i, j);
    }
  }

}
