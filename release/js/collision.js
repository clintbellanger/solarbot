/**
 * Collision functions
 * requires labyrinth.js
 * requires tileset.js
 */

 
var collision = new Object();

collision.isWithin = function(point, rect) {
  if (point.x < rect.x) return false;
  if (point.y < rect.y) return false;
  if (point.x > rect.x + rect.w) return false;
  if (point.y > rect.y + rect.h) return false;
  return true;
}

collision.tileHasCollision = function(grid_x, grid_y) {
  
  // assume no collision off screen
  if (grid_x < 0 || grid_y < 0) return false;
  if (grid_x >= labyrinth.room_tile_width || grid_y >= labyrinth.room_tile_height) return false;
  
  var tile_id = labyrinth.get_tile(grid_x, grid_y);
  return tileset.tile_metadata[tile_id].collide;
}

/**
 * convert position (x.y) floats to grid ints
 */
collision.posToGrid = function(position) {
   return Math.floor(position / tileset.tile_size);
}

collision.movedUp = function(rect) {
  
  var grid_y = collision.posToGrid(rect.y);
  var grid_left = collision.posToGrid(rect.x);
  var grid_right = collision.posToGrid(rect.x + rect.w -1);
  
  var collided = false;
  var new_y = rect.y;
    
  if (collision.tileHasCollision(grid_left, grid_y) || collision.tileHasCollision(grid_right, grid_y)) {
     collided = true;
     // correct to next tile below
     new_y = ((grid_y + 1) * tileset.tile_size);
  }
  
  return {collided:collided, new_y:new_y};
  
}

collision.movedDown = function(rect) {
  
  var grid_y = collision.posToGrid(rect.y + rect.h);
  var grid_left = collision.posToGrid(rect.x);
  var grid_right = collision.posToGrid(rect.x + rect.w -1);
  
  var collided = false;
  var new_y = rect.y;
    
  if (collision.tileHasCollision(grid_left, grid_y) || collision.tileHasCollision(grid_right, grid_y)) {
     collided = true;
     // correct to next tile above
     new_y = (grid_y * tileset.tile_size - rect.h);
  }
  
  return {collided:collided, new_y:new_y};
  
}

/**
 * Are we on the ground right now?
 */
collision.groundCheck = function(rect) {

  var one_pixel_down = 1;
  var grid_y = collision.posToGrid(rect.y + rect.h + one_pixel_down);
  var grid_left = collision.posToGrid(rect.x);
  var grid_right = collision.posToGrid(rect.x + rect.w -1);
  
  console.log(rect.x);
  
  if (collision.tileHasCollision(grid_left, grid_y) || collision.tileHasCollision(grid_right, grid_y)) {
    return true;
  } 
  return false;
}

collision.movedLeft = function(rect) {
  
  var grid_x = collision.posToGrid(rect.x);
  var grid_top = collision.posToGrid(rect.y);
  var grid_bottom = collision.posToGrid(rect.y + rect.h -1);
  
  var collided = false;
  var new_x = rect.x;
    
  if (collision.tileHasCollision(grid_x, grid_top) || collision.tileHasCollision(grid_x, grid_bottom)) {
     collided = true;
     // correct to next tile to the right
     new_x = (grid_x + 1) * tileset.tile_size;
  }
  
  return {collided:collided, new_x:new_x};
  
}

collision.movedRight = function(rect) {
  
  var grid_x = collision.posToGrid(rect.x + rect.w);
  var grid_top = collision.posToGrid(rect.y);
  var grid_bottom = collision.posToGrid(rect.y + rect.h -1);
  
  var collided = false;
  var new_x = rect.x;
   
  if (collision.tileHasCollision(grid_x, grid_top) || collision.tileHasCollision(grid_x, grid_bottom)) {
     collided = true;
     // correct to next tile to the left
     new_x = (grid_x -1) * tileset.tile_size;
  }
  
  return {collided:collided, new_x:new_x};
  
}