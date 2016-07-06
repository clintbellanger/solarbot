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

  // handle horizontal speed changes from player input
  if (rover.on_ground) rover.accelerate_ground();
  else rover.accelerate_air();  
  rover.x += rover.speed_x;
  
  // handle vertical speed changes from jumping and gravity
  rover.jump();
  rover.apply_gravity();  
  rover.y += rover.speed_y;

  // landing, etc.
  rover.check_collisions();
  
  rover.screen_wrap();
  
  // handle wheel animation
  rover.accelerate_wheel(rover.wheel_left);
  rover.accelerate_wheel(rover.wheel_right);
  
  rover.position_wheels();
  rover.position_head();
  rover.position_chassis();  
  
}

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

rover.apply_gravity = function() {
  if (!rover.on_ground) {
    rover.speed_y += rover.gravity_acceleration;
  } 
}

/**
 * Rover has already moved x,y for this frame.
 * Correct for collisions if necessary.
 */
rover.check_collisions = function() {
  
  // mid-air, moving down, hit ground  
  rover.check_landing();

  // on-ground, drove off edge
  rover.check_falling();
    
}

/**
 * Handle the rover landing on ground
 */
rover.check_landing = function() {
    
  // down movement
  if (!rover.on_ground) {
    if (rover.speed_y > 0) {      
  
      var move_result = collision.movedDown(rover.get_rect());
      
      if (move_result.collided) {
        rover.speed_y = 0;        
        rover.on_ground = true;
        rover.y = move_result.new_y;
        rover.landing_frames_remaining =  rover.landing_max_frames;
      
      }
	  }
  }    
}

/**
 * Drove off edge
 */
rover.check_falling = function() {
  if (!collision.groundCheck(rover.get_rect())) {
    rover.on_ground = false;    
  }
}
 
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
