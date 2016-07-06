/**
  Player-controlled robot rover.
  - Solar powered
  - Not weaponized
  - Can be upgraded
 */

var FACING_LEFT = 0;
var FACING_RIGHT = 1;

var rover = new Object();

rover.init = function() {

  // display properties
  rover.chassis = imageset.load("images/rover_chassis.png");
  rover.wheels = imageset.load("images/rover_wheels.png");
  rover.head = imageset.load("images/rover_head.png");
  
  rover.width = 16;
  rover.height = 16;

  // rover movement properties
  // horizontal
  rover.max_speed = 2.0;   
  rover.ground_acceleration = 0.12;
  rover.ground_deceleration = 0.12;
  rover.air_acceleration = 0.06;
  rover.air_deceleration = 0.03;
  
  
  rover.jump_max_frames = 20;
  rover.landing_max_frames = 4;
  //vertical
  rover.jump_speed_y = -2; // power of a new or held jump
  rover.gravity_acceleration = 0.1;
  rover.max_vertical_speed = 4.0;

  // rover current state   
  // horizontal
  rover.x = 56;
  rover.y = 64;
  rover.speed_x = 0.0;
  rover.speed_y = 0.0;
  // vertical
  rover.on_ground = true;
  rover.jump_startup_frames_remaining = 0;
  rover.landing_frames_remaining = 0;
  rover.chassis_offset_y = 0;
  
  // wheel movement properties
  rover.wheel_acceleration = 0.1;
  rover.wheel_max_speed = 1;
  rover.wheel_max_air_speed = 1.5;
  
  // wheels current state
  // offset from center of chassis
  // rotation is 0.0 through < 8.0 for frame count
  rover.wheel_left = new Object();
  rover.wheel_left.x_offset = 0;
  rover.wheel_left.y_offset = 10;
  rover.wheel_left.rotation = 0.0;
  rover.wheel_left.speed = 0.0;
  
  // TODO: second wheel should? be a fixed 2-frames from first wheel
  // so it doesn't need its own rotation or speed calculations.
  rover.wheel_right = new Object();
  rover.wheel_right.x_offset = 11;
  rover.wheel_right.y_offset = 10;
  rover.wheel_right.rotation = 2.0;
  rover.wheel_right.speed = 0.0;
  
  // head current state
  rover.head_frame = 0;
  rover.facing = FACING_LEFT;
  
}

rover.get_rect = function() {
  return {x:rover.x, y:rover.y, w:rover.width, h:rover.height}; 
}

rover.logic = function() {
  redraw = true;

  // handle horizontal acceleration from player input
  if (rover.on_ground) rover.accelerate_ground();
  else rover.accelerate_air();  
  
  // handle vertical acceleration from jumping and gravity
  rover.jump();
  rover.apply_gravity();  
  
  // move by current velocity, affected by collisions.
  rover.movement();
  
  // TEMP: stay on one screen
  rover.screen_wrap();
  
  // handle animations
  rover.accelerate_wheel(rover.wheel_left);
  rover.accelerate_wheel(rover.wheel_right);  
  rover.position_wheels();
  rover.position_head();
  rover.position_chassis();  
  
}

/**** Rover acceleration functions *******************************************/

/**
 * Horizontal (x-axis) movement when on the ground.
 */ 
rover.accelerate_ground = function() {

  // accelerate based on player input
  if (pressing.right) rover.speed_x += rover.ground_acceleration;
  else if (pressing.left) rover.speed_x -= rover.ground_acceleration;
  
  // otherwise slow down
  else if (rover.speed_x > rover.ground_deceleration) rover.speed_x -= rover.ground_deceleration;
  else if (rover.speed_x < -1 * rover.ground_deceleration) rover.speed_x += rover.ground_deceleration;
  else rover.speed_x = 0.0;
  
  // cap max speeds
  if (rover.speed_x > rover.max_speed) rover.speed_x = rover.max_speed;
  if (rover.speed_x < -1 * rover.max_speed) rover.speed_x = -1 * rover.max_speed;
  
}

/**
 * Horizontal (x-axis) movement while in the air.
 */
rover.accelerate_air = function() {
  // accelerate based on player input
  if (pressing.right) rover.speed_x += rover.air_acceleration;
  else if (pressing.left) rover.speed_x -= rover.air_acceleration;
  
  // otherwise slow down
  else if (rover.speed_x > rover.air_deceleration) rover.speed_x -= rover.air_deceleration;
  else if (rover.speed_x < -1 * rover.air_deceleration) rover.speed_x += rover.air_deceleration;
  else rover.speed_x = 0.0;
  
  // cap max speeds
  if (rover.speed_x > rover.max_speed) rover.speed_x = rover.max_speed;
  if (rover.speed_x < -1 * rover.max_speed) rover.speed_x = -1 * rover.max_speed;
}

/**
 * Vertical acceleration when jump button held
 */
rover.jump = function() {
  
  // this function is about accelerating upward on input
  // If no longer pressing the jump button, let gravity do the rest.
  if (!pressing.up && !pressing.action) {
    rover.jump_startup_frames_remaining = 0;
    return;
  }
  
  // must be on_ground to jump
  // or, having just left the ground and still holding the jump button
  if (!rover.on_ground && rover.jump_startup_frames_remaining == 0) return;
   
  if (pressing.up || pressing.action) {
  
    // start a new jump
    if (rover.on_ground) {
      rover.on_ground = false;
	  rover.jump_startup_frames_remaining = rover.jump_max_frames;
	}
	 
	// accelerate up	
	rover.speed_y = rover.jump_speed_y;
	rover.jump_startup_frames_remaining--;
  }
}

/**
 * Vertical acceleration by grav constant
 */
rover.apply_gravity = function() {
  if (!rover.on_ground) {
    rover.speed_y += rover.gravity_acceleration;
  } 
}

/**** Rover velocity and collision  ******************************************/

/**
 * Collision-responsive movement
 */
rover.movement = function() {

  if (rover.speed_x < 0) rover.move_left(); 
  else if (rover.speed_x > 0) rover.move_right();
  
  if (rover.speed_y < 0) rover.move_up();
  else if (rover.speed_y > 0) rover.move_down();
  else if (rover.on_ground) rover.check_fall();
  
}

rover.move_left = function() {
  var blocked = collision.collideLeft(rover.get_rect(), rover.speed_x);
  if (!blocked) rover.x += rover.speed_x;
  else {
    rover.x = collision.snapLeft(rover.x);
	rover.speed_x = 0;
  }
}

rover.move_right = function() {
  var blocked = collision.collideRight(rover.get_rect(), rover.speed_x);
  if (!blocked) rover.x += rover.speed_x;
  else {
    rover.x = collision.snapRight(rover.x, rover.width);
	rover.speed_x = 0;
  }
}

rover.move_up = function() {
  var blocked = collision.collideUp(rover.get_rect(), rover.speed_y);
  if (!blocked) rover.y += rover.speed_y;
  else {    
    rover.y = collision.snapUp(rover.y);
	rover.speed_y = 0;
	rover.jump_startup_frames_remaining = 0;
  }
}

rover.move_down = function() {

  var blocked = collision.collideDown(rover.get_rect(), rover.speed_y);
  if (!blocked) rover.y += rover.speed_y;
  else {
    rover.y = collision.snapDown(rover.y, rover.height);
	rover.speed_y = 0;
    rover.on_ground = true;
    rover.landing_frames_remaining = rover.landing_max_frames;	
  }
}

/**
 * If no longer touching ground, start falling
 */
rover.check_fall = function() {
  if (!collision.groundCheck(rover.get_rect())) {
    rover.on_ground = false
  }
}

/**** Rover animation functions **********************************************/

rover.accelerate_wheel = function(wheel) {

  // accelerate based on player input
  if (pressing.right) wheel.speed += rover.wheel_acceleration;
  else if (pressing.left) wheel.speed -= rover.wheel_acceleration;
  
  // otherwise slow down
  else if (wheel.speed > rover.wheel_acceleration) wheel.speed -= rover.wheel_acceleration;
  else if (wheel.speed < -1 * rover.wheel_acceleration) wheel.speed += rover.wheel_acceleration;
  else wheel.speed = 0.0;
  
  // cap max speeds
  if (rover.on_ground) {
    if (wheel.speed > rover.wheel_max_speed) wheel.speed = rover.wheel_max_speed;
    if (wheel.speed < -1 * rover.wheel_max_speed) wheel.speed = -1 * rover.wheel_max_speed;
  }
  else {
    if (wheel.speed > rover.wheel_max_air_speed) wheel.speed = rover.wheel_max_air_speed;
    if (wheel.speed < -1 * rover.wheel_max_air_speed) wheel.speed = -1 * rover.wheel_max_air_speed;  
  }
  
  // rotate tire
  wheel.rotation += wheel.speed;
  if (wheel.rotation < 0) wheel.rotation += 8;
  if (wheel.rotation >= 8) wheel.rotation -= 8;
  
}

rover.position_head = function() {
  if (pressing.right) {
    rover.facing = FACING_RIGHT;
    if (rover.head_frame < 4) rover.head_frame++;
  }
  else if (pressing.left) {
    rover.facing = FACING_LEFT;
    if (rover.head_frame > 0) rover.head_frame--;
  }
  else if (rover.facing == FACING_RIGHT) {
    if (rover.head_frame < 4) rover.head_frame++;
  }
  else if (rover.facing == FACING_LEFT) {
    if (rover.head_frame > 0) rover.head_frame--;
  }
}

rover.position_wheels = function() {

  // if moving up, wheels down and together
  if (rover.speed_y < -0.5 && rover.jump_startup_frames_remaining > 0) {
    rover.wheel_left.x_offset = 1;
    rover.wheel_left.y_offset = 12;
    rover.wheel_right.x_offset = 10;
    rover.wheel_right.y_offset = 12;	 
  }
  // spread wheels out on landing
  else if (rover.landing_frames_remaining > 0) {
    rover.wheel_left.x_offset = -1;
    rover.wheel_left.y_offset = 10;
    rover.wheel_right.x_offset = 12;
    rover.wheel_right.y_offset = 10;	     
  }
  // neutral position
  else {
    rover.wheel_left.x_offset = 0;
    rover.wheel_left.y_offset = 10;
    rover.wheel_right.x_offset = 11;
    rover.wheel_right.y_offset = 10;
  }

}

rover.position_chassis = function() {
  if (rover.landing_frames_remaining > 0) {
    rover.chassis_offset_y = 1;
	rover.landing_frames_remaining--;
  }
  else {
    rover.chassis_offset_y = 0;
  }
}

rover.screen_wrap = function() {
  if (rover.x > VIEW_WIDTH) {
    rover.x -= VIEW_WIDTH + rover.width;
  }
  else if (rover.x < -1 * rover.width) {
    rover.x += VIEW_WIDTH + rover.width;
  }
}

/**************************** Rendering Functions ****************************/

rover.render = function() {

  //chassis in main position
  imageset.render(
    rover.chassis,
	 0,0,
	 rover.width,rover.height,
	 Math.round(rover.x),rover.y + rover.chassis_offset_y
  );

  rover.render_wheel(rover.wheel_left);
  rover.render_wheel(rover.wheel_right);
  rover.render_head();
}

rover.render_wheel = function(wheel) {

  var x = Math.round(rover.x + wheel.x_offset);
  var y = Math.round(rover.y + wheel.y_offset);

  var animation_frame = Math.floor(wheel.rotation);

  imageset.render(
    rover.wheels,
	 8 * animation_frame + 1,2,
	 5,6,
	 Math.round(x),
	 Math.round(y)
  );
}

rover.render_head = function() {
  imageset.render(
    rover.head,
	 (rover.head_frame * 16),0,
	 16,6,
	 Math.round(rover.x), Math.round(rover.y) + rover.chassis_offset_y
  );

}
