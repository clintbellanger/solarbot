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
  bots.types.ROVER = 0;
  bots.types.TANK = 1;   // green claw bot, moves left/right on platform
  bots.types.PISTON = 2; // green piston bot, as above but speeds up vs the rover
  bots.types.DRONE = 3;  // orange bot with gears on top, flies up/down
  bots.types.UFO = 4;    // orange bot with gears in middle, flies left/right
  bots.types.SENTRY = 5; // red bot with spike, flies up/down on rover proximity  
  
  bots.metadata = []; // index is bots.types
  // values that are static metadata, e.g. frame info. varying by bot type    
  
  bots.state = []; // index is bot_id
  // values are internal animation and logic info, varying by bot type
  // bots.state[].type is of value bots.types
  // this is any calculated data that persist btw frames e.g. speed, `
  
  bots.sprite = []; // index is bot_id
  // values are {src_x, src_y, dest_x, dest_y}
  // calculated each frame by the bot type's logic()

  bots.collision = []; // index is bot_id
  // values are rectangle {x, y, w, h}
  // calculated each frame by the bot type's logic()
 
  bots.load_metadata();
  bots.spawns = [];
}

bots.load_metadata = function() {

  // TANK
  bots.metadata[bots.types.TANK] = {};
  var tank = bots.metadata[bots.types.TANK];
  tank.states = {};
  tank.states.LEFT = 0;
  tank.states.RIGHT = 1;
  tank.frames = [];
  tank.frames[tank.states.LEFT] = [{x:2, y:2},{x:22, y:2},{x:42, y:2}];
  tank.frames[tank.states.RIGHT] = [{x:62, y:2},{x:82, y:2},{x:102, y:2}];
  tank.base_anim = [];
  tank.base_anim[tank.states.LEFT] = Animation(0, 0.3, 3, true);
  tank.base_anim[tank.states.RIGHT] = Animation(0, 0.3, 3, true);  
  tank.max_speed = [];
  tank.max_speed[tank.states.LEFT] = -0.5;
  tank.max_speed[tank.states.RIGHT] = 0.5;
  tank.collision_margin = {top:2, bottom:1, left:1, right:1};
  tank.on_ground = true;
  tank.hazardous_top = false;
  
  // PISTON
  bots.metadata[bots.types.PISTON] = {};
  var piston = bots.metadata[bots.types.PISTON];
  piston.states = {};
  piston.states.LEFT = 0;
  piston.states.RIGHT = 1;
  piston.states.CHARGE_LEFT = 2;
  piston.states.CHARGE_RIGHT = 3;
  piston.frames = [];
  piston.frames[piston.states.LEFT] = [{x:2, y:22},{x:22, y:22},{x:42, y:22}];
  piston.frames[piston.states.RIGHT] = [{x:62, y:22},{x:82, y:22},{x:102, y:22}];
  piston.frames[piston.states.CHARGE_LEFT] = [{x:122, y:22},{x:142, y:22},{x:162, y:22}];
  piston.frames[piston.states.CHARGE_RIGHT] = [{x:182, y:22},{x:202, y:22},{x:222, y:22}];    
  piston.base_anim = [];
  piston.base_anim[piston.states.LEFT] = Animation(0, 0.2, 3, true);
  piston.base_anim[piston.states.RIGHT] = Animation(0, 0.2, 3, true);
  piston.base_anim[piston.states.CHARGE_LEFT] = Animation(0, 0.4, 3, true);
  piston.base_anim[piston.states.CHARGE_RIGHT] = Animation(0, 0.4, 3, true);  
  piston.max_speed = [];
  piston.max_speed[piston.states.LEFT] = -0.3;
  piston.max_speed[piston.states.RIGHT] = 0.3;
  piston.max_speed[piston.states.CHARGE_LEFT] = -0.9;
  piston.max_speed[piston.states.CHARGE_RIGHT] = 0.9;  
  piston.collision_margin = {top:2, bottom:1, left:1, right:1};  
  piston.on_ground = true;
  piston.hazardous_top = false;  

  // UFO
  bots.metadata[bots.types.UFO] = {};
  var ufo = bots.metadata[bots.types.UFO];
  ufo.states = {};
  ufo.states.LEFT = 0;
  ufo.states.RIGHT = 1;
  ufo.frames = [];
  ufo.frames[ufo.states.LEFT] = [{x:2, y:62},{x:22, y:62},{x:42, y:62},{x:62, y:62},{x:82, y:62}];
  ufo.frames[ufo.states.RIGHT] = [{x:102, y:62},{x:122, y:62},{x:142, y:62},{x:162, y:62},{x:182, y:62}];  
  ufo.base_anim = [];
  ufo.base_anim[ufo.states.LEFT] = Animation(0, 0.5, 5, true);
  ufo.base_anim[ufo.states.RIGHT] = Animation(0, 0.5, 5, true);
  ufo.max_speed = [];
  ufo.max_speed[ufo.states.LEFT] = -1;
  ufo.max_speed[ufo.states.RIGHT] = 1;
  ufo.collision_margin = {top:1, bottom:3, left:1, right:1};    
  ufo.on_ground = false;
  ufo.hazardous_top = false;
  
  // DRONE
  bots.metadata[bots.types.DRONE] = {};
  var drone = bots.metadata[bots.types.DRONE];
  drone.states = {};
  drone.states.LEFT = 0;
  drone.states.RIGHT = 1;
  drone.frames = [];
  drone.frames[drone.states.LEFT] = [{x:2, y:42},{x:22, y:42},{x:42, y:42},{x:62, y:42},{x:82, y:42}];
  drone.frames[drone.states.RIGHT] = [{x:102, y:42},{x:122, y:42},{x:142, y:42},{x:162, y:42},{x:182, y:42}];  
  drone.base_anim = [];
  drone.base_anim[drone.states.LEFT] = Animation(0, 0.5, 5, true);
  drone.base_anim[drone.states.RIGHT] = Animation(0, 0.5, 5, true);
  drone.max_speed = [];
  drone.max_speed[drone.states.LEFT] = -0.5;
  drone.max_speed[drone.states.RIGHT] = 0.5;
  drone.collision_margin = {top:1, bottom:3, left:1, right:1};  
  drone.on_ground = false;
  drone.hazardous_top = true;
  
  // SENTRY
  bots.metadata[bots.types.SENTRY] = {};
  var sentry = bots.metadata[bots.types.SENTRY];
  
}

// set up spawn point for a specific bot
bots.add_spawn = function(bot_type, room_x, room_y, tile_x, tile_y, state) {
  bots.spawns.push({type:bot_type, room_x:room_x, room_y:room_y, tile_x:tile_x, tile_y:tile_y, state:state}); 
}

// place bot into current room
bots.add = function(bot_type, grid_x, grid_y, state) {
  
  var bot_id = bots.count;
  bots.count++;
  
  bots.state[bot_id] = {};
  var newbot = bots.state[bot_id];
  var meta = bots.metadata[bot_type];
  
  newbot.type = bot_type;
  newbot.state = state;
  newbot.x = grid_x * tileset.tile_size;
  newbot.y = grid_y * tileset.tile_size;
  if (meta.on_ground) newbot.y += meta.collision_margin.bottom; // if a ground bot, shift down for collision box to rest on floor
  
  newbot.anim = animate.copy_anim(meta.base_anim[state]);
  newbot.speed = meta.max_speed[state];  
    
  bots.sprite[bot_id] = {};  
  bots.set_collision(bot_id);  

}

bots.init_state = function(bot_id, state_id) {
  var onebot = bots.state[bot_id];
  onebot.state = state_id;
  var meta = bots.metadata[onebot.type];
  var anim = meta.base_anim[state_id];
  onebot.anim = animate.copy_anim(anim);
  onebot.speed = meta.max_speed[state_id];
}

bots.load_room = function(room_x, room_y) {

  bots.clear_room();
  var spawn;
  
  for (var i=0; i<bots.spawns.length; i++) {    
	spawn = bots.spawns[i];
	
    // is this bot in this room?
    if (room_x == spawn.room_x && room_y == spawn.room_y) {
      bots.add(spawn.type, spawn.tile_x, spawn.tile_y, spawn.state);
    }
  }
}

bots.clear_room = function() {
  bots.state = [];
  bots.collision = [];
  bots.sprite = [];
  bots.count = 0;
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
        
      case bots.types.PISTON:
        bots.logic_piston(i);
        break;
		
      case bots.types.UFO:
	    bots.logic_ufo(i);
		break;
		
	  case bots.types.DRONE:
	    bots.logic_drone(i);
		break;
    }
	
	bots.set_collision(i);
	bots.set_sprite(i);
	
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

bots.set_collision = function(bot_id) {
  var onebot = bots.state[bot_id];
  var margins = bots.metadata[onebot.type].collision_margin;
  bots.collision[bot_id] =
    {x:onebot.x + margins.left,
     y:onebot.y + margins.top,
	 w:bots.frame_size - (margins.right + margins.left),
	 h:bots.frame_size - (margins.top + margins.bottom)};
}

bots.set_sprite = function(bot_id) {
  var onebot = bots.state[bot_id];
  var sprite = bots.sprite[bot_id];
  var meta = bots.metadata[onebot.type];
    
  // animation calculations
  sprite.dest_x = Math.round(onebot.x);
  sprite.dest_y = Math.round(onebot.y);
  
  animate.advance(onebot.anim);
  var display_frame = Math.floor(onebot.anim.frame);  
  sprite.src_x = meta.frames[onebot.state][display_frame].x;
  sprite.src_y = meta.frames[onebot.state][display_frame].y;

}

/**** bot AI by type ****/

// tanks patrol left/right on the current platform
bots.logic_tank = function(bot_id) {
  
  var tank = bots.state[bot_id];
  var cbox = bots.collision[bot_id];
  var meta = bots.metadata[tank.type];
  
  // movement and position calculations
  var wall_ahead = collision.collideX(cbox, tank.speed);
  var hole_ahead = collision.holeAhead(cbox, tank.speed);
  var edge_ahead = collision.screenEdgeX(cbox, tank.speed);  

  if (wall_ahead || hole_ahead || edge_ahead) {
    
    // turn around
    if (tank.state == meta.states.LEFT) {
      bots.init_state(bot_id, meta.states.RIGHT);
    }
    else if (tank.state == meta.states.RIGHT) {
      bots.init_state(bot_id, meta.states.LEFT);
    }
  }
  
  tank.x += tank.speed;
}


// pistons patrol left/right on the current platform
// and speed up if they are in line of sight with the rover
bots.logic_piston = function(bot_id) {
  
  var piston = bots.state[bot_id];
  var meta = bots.metadata[piston.type];
  var cbox = bots.collision[bot_id];
  
  // Handle seeing the rover and speeding up
  var viewbox = {x: cbox.x, y: cbox.y, w: cbox.w, h: cbox.h};
  // look for the rover if going slow
  if (piston.state == meta.states.LEFT) {
    viewbox.w += viewbox.x; // stretch this collision box
    viewbox.x = 0; // to the left edge
  }
  else if (piston.state == meta.states.RIGHT) {
    viewbox.w = (VIEW_WIDTH - viewbox.x); // stretch to right edge
  }
  
  rbox = rover.get_collision_box();
  if (collision.rectsOverlap(viewbox, rbox)) {
  
    // rover was spotted. increase speed!
    if (piston.state == meta.states.RIGHT) {
      bots.init_state(bot_id, meta.states.CHARGE_RIGHT);
    }
    else if (piston.state == meta.states.LEFT) {
      bots.init_state(bot_id, meta.states.CHARGE_LEFT);
    }    
  }
  
  // movement and position calculations
  var wall_ahead = collision.collideX(cbox, piston.speed);  
  var edge_ahead = collision.screenEdgeX(cbox, piston.speed);
  var hole_ahead = collision.holeAhead(cbox, piston.speed);
  
  // turn around if we run out of floor
  if (wall_ahead || edge_ahead || hole_ahead) {
    
    if (piston.state == meta.states.LEFT || piston.state == meta.states.CHARGE_LEFT) {
      bots.init_state(bot_id, meta.states.RIGHT);
    }
    else if (piston.state == meta.states.RIGHT || piston.state == meta.states.CHARGE_RIGHT) {
      bots.init_state(bot_id, meta.states.LEFT);
    }    
  }
  
  // TODO: hole_below and going from fast to slow is causing the bot to be stuck always over some hole  
  
  piston.x += piston.speed;
}


// ufos patrol left/right in mid air
bots.logic_ufo = function(bot_id) {

  var ufo = bots.state[bot_id];
  var meta = bots.metadata[ufo.type];
  var cbox = bots.collision[bot_id];
  
  // movement and position calculations
  var wall_ahead = collision.collideX(cbox, ufo.speed);
  var edge_ahead = collision.screenEdgeX(cbox, ufo.speed);

  if (wall_ahead || edge_ahead) {
    ufo.speed *= -1; // turn around
	if (ufo.speed < 0) ufo.state = meta.states.LEFT;
	else ufo.state = meta.states.RIGHT;
  }
  
  ufo.x += ufo.speed;
   
}

// drones patrol up/down in mid air
// drones also have hazardous_top so it hurts to bounce on them
bots.logic_drone = function(bot_id) {

  var drone = bots.state[bot_id];
  var cbox = bots.collision[bot_id];6
  
  // movement and position calculations
  var wall_ahead = collision.collideY(cbox, drone.speed);
  var edge_ahead = collision.screenEdgeY(cbox, drone.speed);  

  if (wall_ahead || edge_ahead) {
    drone.speed *= -1; // turn around
  }
  
  drone.y += drone.speed;
}
