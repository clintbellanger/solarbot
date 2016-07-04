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
[0,0,0,0,0,6,4,4],
[0,0,0,0,0,6,4,4],
[0,0,0,0,0,6,4,4],
[0,0,0,0,0,6,4,4],
[1,2,2,2,2,2,2,3],
[2,2,3,1,2,3,1,2],
[3,5,5,5,5,5,5,1]];

}

labyrinth.draw_room = function() {

  for (var i=0; i<8; i++) {
    for (var j=0; j<8; j++) {
	  tileset.draw_tile(labyrinth.room_tiles[j][i], i, j);
    }
  }

}
