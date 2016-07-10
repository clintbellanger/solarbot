/**
 Tilesets.
 goal: tile indexes represent similar shapes across sets
       so that swapping a tileset keeps a map intact.
	   
  Dependencies:
  imageset.js
*/

var tileset = new Object();

tileset.init = function() {
  tileset.img = imageset.load("images/tileset_industrial.png");
  tileset.tile_size = 16;
  tileset.row_tilecount = 4;
  
  tileset.tile_metadata = new Array();
  for (var i=0; i<=16; i++) {
    tileset.tile_metadata[i] = new Object();
	tileset.tile_metadata[i].collide = false;
  }
  tileset.tile_metadata[1].collide = true;
  tileset.tile_metadata[2].collide = true;
  tileset.tile_metadata[3].collide = true;
  tileset.tile_metadata[9].collide = true;
  tileset.tile_metadata[10].collide = true;
  tileset.tile_metadata[11].collide = true;
  
}

/**
  grid x,y is in tile count, not pixel count.
  (0,0) is upperleft tile.
 */
tileset.draw_tile = function(tile_index, grid_x, grid_y) {
  if (tile_index == 0) return;
  

  var posx = ((tile_index-1) % tileset.row_tilecount) * tileset.tile_size;
  var posy = Math.floor(((tile_index-1) / tileset.row_tilecount)) * tileset.tile_size;

  imageset.render(
    tileset.img,
	posx, posy,
	tileset.tile_size,tileset.tile_size,
	grid_x * tileset.tile_size,
	grid_y * tileset.tile_size
  );

}