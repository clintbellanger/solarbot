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
   rover.max_speed = 2.0;   
   rover.acceleration = 0.125;

   // rover current state   
   rover.x = 56;
   rover.y = 64;
   rover.speed_x = 0.0;
   
   // wheel movement properties
   rover.wheel_acceleration = 0.1;
   rover.wheel_max_speed = 1;
   
   // wheels current state
   // offset from center of chassis
   // rotation is 0.0 through < 8.0 for frame count
   rover.wheel_left = new Object();
   rover.wheel_left.x_offset = 0;
   rover.wheel_left.y_offset = 10;
   rover.wheel_left.rotation = 0.0;
   rover.wheel_left.speed = 0.0;
   
   rover.wheel_right = new Object();
   rover.wheel_right.x_offset = 11;
   rover.wheel_right.y_offset = 10;
   rover.wheel_right.rotation = 2.0;
   rover.wheel_right.speed = 0.0;
   
   // head current state
   rover.head_frame = 0;
   rover.facing = FACING_LEFT;
   
 }
 
 rover.logic = function() {
   redraw = true;
 
   // handle speed changes from player input
   rover.accelerate();
 
   // move
   rover.x += rover.speed_x;
   
   rover.screen_wrap();
   
   // handle wheel animation
   rover.accelerate_wheel(rover.wheel_left);
   rover.accelerate_wheel(rover.wheel_right);
   
   rover.animate_head();
   
 }
 
 rover.accelerate = function() {
 
   // accelerate based on player input
   if (pressing.right) rover.speed_x += rover.acceleration;
   else if (pressing.left) rover.speed_x -= rover.acceleration;
   
   // otherwise slow down
   else if (rover.speed_x > rover.acceleration) rover.speed_x -= rover.acceleration;
   else if (rover.speed_x < -1 * rover.acceleration) rover.speed_x += rover.acceleration;
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
   if (wheel.speed > rover.wheel_max_speed) wheel.speed = rover.wheel_max_speed;
   if (wheel.speed < -1 * rover.wheel_max_speed) wheel.speed = -1 * rover.wheel_max_speed;
   
   // rotate tire
   wheel.rotation += wheel.speed;
   if (wheel.rotation < 0) wheel.rotation += 8;
   if (wheel.rotation >= 8) wheel.rotation -= 8;
   
 }
 
 rover.animate_head = function() {
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
	 Math.round(rover.x),rover.y
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
	 Math.round(rover.x),
	 Math.round(rover.y)
   );
 
 }
 