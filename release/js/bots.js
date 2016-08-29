/**
 AI robots, including passive and enemy bots
 */

var bots = {};

bots.init = function() {

  bots.img = imageset.load("images/bots.png");
  bots.frame_size = 16; // for now each frame is 16x16, which is the case for the current art

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
  // bots.state_info.type
  // this is any calculated data that persist btw frames e.g. speed, facing
  
  bots.sprite = []; // index is bot_id
  // values are {src_x, src_y, dest_x, dest_y}
  // calculated each frame by the bot type's logic()

  bots.collision = []; // index is bot_id
  // values are rectangle {x, y, w, h}
  // calculated each frame by the bot type's logic()

  
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

}

bots.render = function() {

}

bots.render_single = function(bot_id) {

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
  
  if (!collision.collideX(cbox, tank.speed)) {
    tank.x += tank.speed;
    bots.set_collision(bot_id);  
  }
  else {
    tank.speed *= -1; // flip direction
  }
  
  // animation calculations
  if (tank.speed < 0) tank.facing = bots.directions.LEFT;
  else tank.facing = bots.directions.RIGHT;

  animate.advance(tank.anim);
  
}
