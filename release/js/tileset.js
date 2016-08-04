/**
 Tilesets.
 goal: tile indexes represent similar shapes across sets
       so that swapping a tileset keeps a map intact.
	   
  Dependencies:
  imageset.js
*/

var tileset = new Object();

tileset.init = function() {
  tileset.img = imageset.load("images/tileset_gutters.png");
  tileset.tile_size = 16;
  tileset.row_tilecount = 4;
  
  tileset.info = new Array();
  for (var i=0; i<=32; i++) {
    tileset.info[i] = new Object();
	tileset.info[i].collide = false;
	
	// support spikes and similar dangerous terrain
	tileset.info[i].hazardous_top = false;
	tileset.info[i].hazardous_bottom = false;
	
	tileset.info[i].src = {x:0, y:0};
  }
  
  tileset.info[1].collide = true;
  tileset.info[2].collide = true;
  tileset.info[3].collide = true;
  tileset.info[7].collide = true;
  tileset.info[7].hazardous_top = true;
  tileset.info[8].collide = true;
  tileset.info[8].hazardous_bottom = true;
  tileset.info[9].collide = true;
  tileset.info[10].collide = true;
  tileset.info[11].collide = true;
  tileset.info[13].collide = true;
  tileset.info[14].collide = true;
  tileset.info[15].collide = true;
  tileset.info[16].collide = true;
  tileset.info[17].collide = true;
  tileset.info[18].collide = true;
  tileset.info[19].collide = true;
  
  
  // tile atlas positions
  // using bleed and gutters to help with scaling artifacts
  tileset.info[1].src = {x:2, y:2};
  tileset.info[2].src = {x:22, y:2};
  tileset.info[3].src = {x:42, y:2};
  tileset.info[4].src = {x:62, y:2};
  tileset.info[5].src = {x:2, y:22};
  tileset.info[6].src = {x:22, y:22};
  tileset.info[7].src = {x:42, y:22};
  tileset.info[8].src = {x:62, y:22};
  tileset.info[9].src = {x:2, y:42};
  tileset.info[10].src = {x:22, y:42};
  tileset.info[11].src = {x:42, y:42};
  tileset.info[12].src = {x:62, y:42};  
  tileset.info[13].src = {x:2, y:62};
  tileset.info[14].src = {x:22, y:62};
  tileset.info[15].src = {x:42, y:62};
  tileset.info[16].src = {x:62, y:62};
  tileset.info[17].src = {x:2, y:82};
  tileset.info[18].src = {x:22, y:82};
  tileset.info[19].src = {x:42, y:82};
  
  
}

/**
  grid x,y is in tile count, not pixel count.
  (0,0) is upperleft tile.
 */
tileset.draw_tile = function(tile_index, grid_x, grid_y) {

  // tile 0 is reserved for "blank"
  // only the background color shows
  if (tile_index == 0) return;
  
  imageset.render(
    tileset.img,
	tileset.info[tile_index].src.x,
	tileset.info[tile_index].src.y,
	tileset.tile_size,tileset.tile_size,
	grid_x * tileset.tile_size,
	grid_y * tileset.tile_size
  );

}