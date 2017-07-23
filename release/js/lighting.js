/**
Tile-based lighting
 */

var lighting = new Object();

lighting.init = function() {

  lighting.tiles = {};
  lighting.tiles.img = imageset.load("images/lighting_tiles.png");
  lighting.tiles.metadata = [];
  lighting.tiles.size = 8;
  lighting.tiles.metadata[0] = {}; // empty
  
  // tiles 1-5 make up the god rays
  lighting.tiles.metadata[1] = {x: 1, y:1};
  lighting.tiles.metadata[2] = {x:11, y:1};
  lighting.tiles.metadata[3] = {x:21, y:1};
  lighting.tiles.metadata[4] = {x:31, y:1};
  lighting.tiles.metadata[5] = {x:41, y:1};
  
  // tiles 6-10 make solid tiles glow where the light hits
  lighting.tiles.metadata[6]  = {x: 1, y:11};
  lighting.tiles.metadata[7]  = {x:11, y:11};
  lighting.tiles.metadata[8]  = {x:21, y:11};
  lighting.tiles.metadata[9]  = {x:31, y:11};
  lighting.tiles.metadata[10] = {x:41, y:11};
  
  // most rooms won't have lights
  // so we don't store light info for the entire map
  // just the rooms that need it
  lighting.rooms = [];
  lighting.load_rooms();
  
}

lighting.load_rooms = function() {

  lighting.rooms[0] = {};
  lighting.rooms[0].pos = {x:2, y:1};

  lighting.rooms[0].tiles = [
  [0, 0, 0, 0, 0, 0, 0,10, 3, 3, 3, 3, 3, 4, 0, 0],
  [0, 0, 0, 0, 0, 0, 0,10, 3, 3, 3, 3, 3, 5, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 4, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 5, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 4, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 5, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 4, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 5, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 3, 3, 4, 7, 7, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 2, 3, 3, 5, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 3, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 2, 3, 3, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 3, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 2, 3, 3, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

  lighting.rooms[1] = {};
  lighting.rooms[1].pos = {x:2, y:0};  
  lighting.rooms[1].tiles = [
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]];
  
}

lighting.get_room_id = function(room_x, room_y) {
  for (var i=0; i<lighting.rooms.length; i++) {
    if (lighting.rooms[i].pos.x == room_x &&
        lighting.rooms[i].pos.y == room_y) {
      return i;   
    }
  }
  return -1; // no lights here
}

lighting.render = function() {
  lighting.render_room(labyrinth.current_room_x, labyrinth.current_room_y);
}

lighting.render_room = function(room_x, room_y) {
  var room_id = lighting.get_room_id(room_x, room_y);
  if (room_id == -1) return; // no lights here
  
  ctx.globalCompositeOperation = "lighter";
  
  var tile_id = 0;
  var meta = {};
  for (var i=0; i<16; i++) {
    for (var j=0; j<16; j++) {
      
      tile_id = lighting.rooms[room_id].tiles[j][i];
      meta = lighting.tiles.metadata[tile_id];
      
      imageset.render(
        lighting.tiles.img,
        meta.x, meta.y,
        8,8,
        i*8, j*8
      );
      
    }
  }
  ctx.globalCompositeOperation = "source-over";  
}

