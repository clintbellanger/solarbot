/**
 * Collision functions
 * requires labyrinth.js
 * requires tileset.js
 */

 
var collision = new Object();

// leave this much space after colliding with a wall
collision.padding = 0.01;

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
  var grid_bottom = collision.posToGrid(rect.y + rect.h-1);
  
  if (collision.tileHasCollision(grid_x, grid_top) || collision.tileHasCollision(grid_x, grid_bottom)) {
    return true;
  }
  return false;
}

collision.collideRight = function(rect, speed_x) {
  var grid_x = collision.posToGrid(rect.x + rect.w + speed_x);
  var grid_top = collision.posToGrid(rect.y);
  var grid_bottom = collision.posToGrid(rect.y + rect.h-1);
  
  if (collision.tileHasCollision(grid_x, grid_top) || collision.tileHasCollision(grid_x, grid_bottom)) {
    return true;
  }
  return false;
}

collision.collideUp = function(rect, speed_y) {
  var grid_y = collision.posToGrid(rect.y + speed_y);
  var grid_left = collision.posToGrid(rect.x);
  var grid_right = collision.posToGrid(rect.x + rect.w-1);
  
  if (collision.tileHasCollision(grid_left, grid_y) || collision.tileHasCollision(grid_right, grid_y)) {
    return true;
  }
  return false;
}

collision.collideDown = function(rect, speed_y) {
  var grid_y = collision.posToGrid(rect.y + rect.h + speed_y);
  var grid_left = collision.posToGrid(rect.x);
  var grid_right = collision.posToGrid(rect.x + rect.w-1);
  
  if (collision.tileHasCollision(grid_left, grid_y) || collision.tileHasCollision(grid_right, grid_y)) {
    return true;
  }
  return false;
}



collision.snapLeft = function(pos_x) {
  var grid_x = Math.round(pos_x / tileset.tile_size);
  var new_x = grid_x * tileset.tile_size + collision.padding;
  return new_x;
}

collision.snapRight = function(pos_x, width) {
  var grid_x = Math.round((pos_x + width) / tileset.tile_size);
  var new_x = grid_x * tileset.tile_size - width + (1-collision.padding);
  return new_x;
}

collision.snapUp = function(pos_y) {
  var grid_y = Math.round(pos_y / tileset.tile_size);
  var new_y = grid_y * tileset.tile_size + collision.padding;
  return new_y;
}

collision.snapDown = function(pos_y, height) {
  var grid_y = Math.round((pos_y + height) / tileset.tile_size);
  var new_y = grid_y * tileset.tile_size - height + (1-collision.padding);  
  return new_y;
}

/**
 Handle spikes and other tiles that work like spikes
 hazardous_bottom
 */
collision.checkSpikesAbove = function(rect, speed_y) {

  var grid_y = collision.posToGrid(rect.y + speed_y);
  var grid_left = collision.posToGrid(rect.x);
  var grid_right = collision.posToGrid(rect.x + rect.w-1);

  // get tile metadata for these two tiles
  var left_tile = tileset.tile_metadata[labyrinth.get_tile(grid_left,grid_y)];
  var right_tile = tileset.tile_metadata[labyrinth.get_tile(grid_right,grid_y)];
  
  // one of the above tiles must be a hazard
  var spikes_found = (left_tile.hazardous_bottom || right_tile.hazardous_bottom);

  // if one of the above tiles is safe and solid, it will
  // block the object from touching the spikes
  var blocked = (left_tile.collide && !left_tile.hazardous_bottom) ||
                (right_tile.collide && !right_tile.hazardous_bottom);

  // touched spikes?
  return (spikes_found && !blocked);
}

/**
 tiles with hazardous tops
 */
collision.checkSpikesBelow = function(rect, speed_y) {

  var grid_y = collision.posToGrid(rect.y + rect.h + speed_y);
  var grid_left = collision.posToGrid(rect.x);
  var grid_right = collision.posToGrid(rect.x + rect.w-1);

  // get tile metadata for these two tiles
  var left_tile = tileset.tile_metadata[labyrinth.get_tile(grid_left,grid_y)];
  var right_tile = tileset.tile_metadata[labyrinth.get_tile(grid_right,grid_y)];
  
  // one of the above tiles must be a hazard
  var spikes_found = (left_tile.hazardous_top || right_tile.hazardous_top);

  // if one of the above tiles is safe and solid, it will
  // block the object from touching the spikes
  var blocked = (left_tile.collide && !left_tile.hazardous_top) ||
                (right_tile.collide && !right_tile.hazardous_top);

  // touched spikes?
  return (spikes_found && !blocked);
}