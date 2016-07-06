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


/**
 * Are we on the ground right now?
 */
collision.groundCheck = function(rect) {

  var grid_y = collision.posToGrid(rect.y + rect.h);
  var grid_left = collision.posToGrid(rect.x);
  var grid_right = collision.posToGrid(rect.x + rect.w -1);
  
  if (collision.tileHasCollision(grid_left, grid_y) || collision.tileHasCollision(grid_right, grid_y)) {
    return true;
  } 
  return false;
}

collision.collideLeft = function(rect, speed_x) {
  var grid_x = collision.posToGrid(rect.x + speed_x);
  var grid_top = collision.posToGrid(rect.y);
  
  // -1 so the height does not clip into the next tile row
  var grid_bottom = collision.posToGrid(rect.y + rect.h -1);
  
  if (collision.tileHasCollision(grid_x, grid_top) || collision.tileHasCollision(grid_x, grid_bottom)) {
    return true;
  }
  return false;
}

collision.collideRight = function(rect, speed_x) {
  var grid_x = collision.posToGrid(rect.x + rect.w + speed_x);
  var grid_top = collision.posToGrid(rect.y);
  
  // -1 so the height does not clip into the next tile row
  var grid_bottom = collision.posToGrid(rect.y + rect.h -1);
  
  if (collision.tileHasCollision(grid_x, grid_top) || collision.tileHasCollision(grid_x, grid_bottom)) {
    return true;
  }
  return false;
}

collision.collideUp = function(rect, speed_y) {
  var grid_y = collision.posToGrid(rect.y + speed_y);
  var grid_left = collision.posToGrid(rect.x);
  var grid_right = collision.posToGrid(rect.x + rect.w -1);
  
  if (collision.tileHasCollision(grid_left, grid_y) || collision.tileHasCollision(grid_right, grid_y)) {
    return true;
  }
  return false;
}

collision.collideDown = function(rect, speed_y) {
  var grid_y = collision.posToGrid(rect.y + rect.h + speed_y);
  var grid_left = collision.posToGrid(rect.x);
  var grid_right = collision.posToGrid(rect.x + rect.w -1);
  
  if (collision.tileHasCollision(grid_left, grid_y) || collision.tileHasCollision(grid_right, grid_y)) {
    return true;
  }
  return false;
}


collision.snapLeft = function(pos_x) {
  var grid_x = collision.posToGrid(pos_x);  
  var new_x = grid_x * tileset.tile_size;  
  return new_x;
}

collision.snapRight = function(pos_x, width) {
  var grid_x = collision.posToGrid(pos_x + width -1) + 1;  
  var new_x = grid_x * tileset.tile_size - width;  
  return new_x;
}

collision.snapUp = function(pos_y) {
  var grid_y = collision.posToGrid(pos_y);  
  var new_y = grid_y * tileset.tile_size;
  return new_y;
}

collision.snapDown = function(pos_y, height) {
  var grid_y = collision.posToGrid(pos_y + height -1) + 1;  
  var new_y = grid_y * tileset.tile_size - height;  
  return new_y;
}
