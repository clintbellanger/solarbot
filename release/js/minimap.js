/**
 Map handling
 Requires labyrinth.js as source map data
 */
 
var minimap = new Object();

minimap.init = function() {

  minimap.unlocked = false;
  minimap.hud_img = imageset.load("images/minimap_tiles.png");
  
  minimap.screen_pos = {x:98, y:4};
  
  // sprite atlas images
  minimap.background_src = {x:0, y:40, w:31, h:21};
  minimap.youarehere_src = {x:2, y:34, w:3, h:3};
  minimap.youarehere_dest = {x:12 + minimap.screen_pos.x, y:8 + minimap.screen_pos.y};
  
  minimap.tile_size = 5;
  minimap.padding = 3; // 3px frame around minimap 
  minimap.tile_src = new Array();
  
  // tiles numbered 0 through 15 as bit field.
  // e.g. room with exits L+R is 12.
  // RLDU
  // 1100  
  minimap.tile_src[0] = {x:1, y:1};
  minimap.tile_src[1] = {x:9, y:1};
  minimap.tile_src[2] = {x:17, y:1};
  minimap.tile_src[3] = {x:25, y:1};
  minimap.tile_src[4] = {x:1, y:9};
  minimap.tile_src[5] = {x:9, y:9};
  minimap.tile_src[6] = {x:17, y:9};
  minimap.tile_src[7] = {x:25, y:9};
  minimap.tile_src[8] = {x:1, y:17};
  minimap.tile_src[9] = {x:9, y:17};
  minimap.tile_src[10] = {x:17, y:17};
  minimap.tile_src[11] = {x:25, y:17};
  minimap.tile_src[12] = {x:1, y:25};
  minimap.tile_src[13] = {x:9, y:25};
  minimap.tile_src[14] = {x:17, y:25};
  minimap.tile_src[15] = {x:25, y:25};
  
  minimap.reset_minimap(labyrinth.room_span_x, labyrinth.room_span_y);
}

minimap.reset_minimap = function(size_x, size_y) {
  
  // this array remember which rooms we've visited
  minimap.visited = [];
  for (var i=0; i<size_x; i++) {
    minimap.visited[i] = [];
    for (var j=0; j<size_y; j++) {
      minimap.visited[i][j] = false;
      }
  }
}

minimap.render = function() {
  if (!minimap.unlocked) return;
  
  minimap.render_background();
  minimap.render_grid();
  minimap.render_youarehere();
}

minimap.render_background = function() {
  // blank background and frame
  imageset.render(
    minimap.hud_img,
    minimap.background_src.x, minimap.background_src.y,
    minimap.background_src.w, minimap.background_src.h,
    minimap.screen_pos.x, minimap.screen_pos.y
  );
}

minimap.render_grid = function() {

  // render nearby rooms, a 5x3 area
  var minimap_tile;
  var room_lookup_x;
  var room_lookup_y;
  
  for (var i=-2; i<=2; i++) {
    for (var j=-1; j<=1; j++) {
    
      room_lookup_x = labyrinth.current_room_x + i;
      room_lookup_y = labyrinth.current_room_y + j;
      
      // is this room inside the map bounds?
      if (labyrinth.valid_room(room_lookup_x, room_lookup_y)) {

        // have we visited this room?      
        if (minimap.visited[room_lookup_x][room_lookup_y]) {      
          minimap_tile = labyrinth.get_room_tile(room_lookup_x, room_lookup_y);
          minimap.render_cell(i,j, minimap_tile);
        }
      }
    }
  }

}

/**
 * cell_x is int ranged -2 through 2
 * cell_y is int ranged -1 through 1
 */
minimap.render_cell = function(cell_x, cell_y, minimap_tile_id) {

  // convert cell positions to grid by tile size
  // -1 because these tiles overlap by 1px
  var pixel_x = (cell_x + 2) * (minimap.tile_size-1);
  var pixel_y = (cell_y + 1) * (minimap.tile_size-1);
  
  imageset.render(
    minimap.hud_img,
    minimap.tile_src[minimap_tile_id].x,
    minimap.tile_src[minimap_tile_id].y,
    minimap.tile_size, minimap.tile_size,
    pixel_x + minimap.screen_pos.x + minimap.padding,
    pixel_y + minimap.screen_pos.y + minimap.padding
  );

}

minimap.render_youarehere = function() {
  imageset.render(
    minimap.hud_img,
    minimap.youarehere_src.x,
    minimap.youarehere_src.y,
    minimap.youarehere_src.w,
    minimap.youarehere_src.h,
    minimap.youarehere_dest.x,
    minimap.youarehere_dest.y
  );
}


