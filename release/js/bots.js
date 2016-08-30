/**
 AI robots, including passive and enemy bots
 */

var bots = {};

bots.init = function() {

  bots.img = imageset.load("images/robots.png");
  bots.frame_size = 16; // for now each frame is 16x16, which is the case for the current art

  bots.count = 0;
  
  // enumeration of the bot types
  bots.types = {};
  bots.types.TANK = 1;   // green claw bot, moves left/right on platform
  bots.types.PISTON = 2; // green piston bot, as above but speeds up vs the rover
  bots.types.DRONE = 3;  // orange bot with gears on top, flies up/down
  bots.types.UFO = 4;    // orange bot with gears in middle, flies left/right
  bots.types.SENTRY = 5; // red bot with spike, flies up/down on rover proximity  
  
  bots.directions = {};
  bots.directions.LEFT = 1;
  bots.directions.RIGHT = 2;
  bots.directions.UP = 3;
  bots.directions.DOWN = 4;
  
  bots.metadata = []; // index is bots.types
  // values that are static metadata, e.g. frame info. varying by bot type
  
  
  bots.metadata[bots.types.TANK] = {};
  var tank = bots.metadata[bots.types.TANK];
  tank.frames_left = [{x:2, y:2},{x:22, y:2},{x:42, y:2}];
  tank.frames_right = [{x:62, y:2},{x:82, y:2},{x:102, y:2}];
  tank.collision_margin = {top:2, bottom:0, left:0, right:0};
  tank.max_speed = 1;
  
  
  bots.state = []; // index is bot_id
  // values are internal animation and logic info, varying by bot type
  // bots.state[].type is of value bots.types
  // this is any calculated data that persist btw frames e.g. speed, facing
  
  bots.sprite = []; // index is bot_id
  // values are {src_x, src_y, dest_x, dest_y}
  // calculated each frame by the bot type's logic()

  bots.collision = []; // index is bot_id
  // values are rectangle {x, y, w, h}
  // calculated each frame by the bot type's logic()

  bots.add(bots.types.TANK, 7, 4, bots.directions.LEFT);
  
}

bots.add = function(bot_type, grid_x, grid_y, facing) {
  
  var bot_id = bots.count;
  bots.count++;

  bots.state[bot_id] = {};
  bots.state[bot_id].type = bot_type;
  bots.state[bot_id].facing = bots.directions.LEFT;
  bots.state[bot_id].x = grid_x * tileset.tile_size;
  bots.state[bot_id].y = grid_y * tileset.tile_size;
  bots.state[bot_id].speed = -bots.metadata[bot_type].max_speed;
  
  bots.state[bot_id].anim = Animation(0, 0.3, 3, true);
  bots.sprite[bot_id] = {};
  
  bots.set_collision(bot_id);
  

}


/**
 * logic common to all robots
 * each bot type has an additional logic script.
 *
 * What every bot needs at render time, minimum:
 * bot sprite sheet source x,y
 * bot screen destination x,y
 * bot collision x,y,w,h
 *
 * Each bot type has a custom logic function that
 * sets the bot's render info. Each individual bot also
 * has a separate object of internal state variables.
  
 
 */
bots.logic = function() {
  for (var i=0; i<bots.count; i++) {

    switch(bots.state[i].type) {
      
      case bots.types.TANK:
        bots.logic_tank(i);
        break;
    }
  }
  
}

bots.render = function() {
  for (var i=0; i<bots.count; i++) {
    bots.render_single(i);
  }
}

bots.render_single = function(bot_id) {
  imageset.render(
    bots.img,
    bots.sprite[bot_id].src_x,
    bots.sprite[bot_id].src_y,
    bots.frame_size, bots.frame_size,
    bots.sprite[bot_id].dest_x,
    bots.sprite[bot_id].dest_y
  );
}

/**** AI scripts for each bot type ****/

bots.set_collision = function(bot_id) {
  var onebot = bots.state[bot_id];
  var margins = bots.metadata[onebot.type].collision_margin;
  bots.collision[bot_id] =
    {x:onebot.x + margins.left,
     y:onebot.y + margins.top,
	 w:bots.frame_size - margins.right - margins.left,
	 h:bots.frame_size - margins.top - margins.bottom};  
}

// bots.types.TANK
bots.logic_tank = function(bot_id) {
  var tank = bots.state[bot_id];
  var cbox = bots.collision[bot_id];
  
  // movement and position calculations
  // checking wall
  if (!collision.collideX(cbox, tank.speed)) {
    tank.x += tank.speed;
    bots.set_collision(bot_id);  
  }
  else {
    tank.speed *= -1; // flip direction
  }
  

  // TODO:
  // turn_around can happen for several other reasons:
  // [x] touched a wall
  // [ ] end of platform
  // [ ] end of screen

  
  // animation calculations
  bots.sprite[bot_id].dest_x = Math.round(tank.x);
  bots.sprite[bot_id].dest_y = Math.round(tank.y);
  
  animate.advance(tank.anim);
  var display_frame = Math.floor(tank.anim.frame);
  
  if (tank.speed < 0) {
    tank.facing = bots.directions.LEFT;
    bots.sprite[bot_id].src_x = bots.metadata[bots.types.TANK].frames_left[display_frame].x;
    bots.sprite[bot_id].src_y = bots.metadata[bots.types.TANK].frames_left[display_frame].y;
  }
  else {
    tank.facing = bots.directions.RIGHT;
    bots.sprite[bot_id].src_x = bots.metadata[bots.types.TANK].frames_right[display_frame].x;
    bots.sprite[bot_id].src_y = bots.metadata[bots.types.TANK].frames_right[display_frame].y;
  } 
}
