

var powerups = new Object();

powerups.init = function() {

  // Jump acquired from jump coil pickup
  powerups.jump = new Object();
  powerups.jump.acquired = false;

  // Double Jump acquired from booster pickup
  powerups.doublejump = new Object();
  
  // usage properties
  powerups.doublejump.acquired = false;
  powerups.doublejump.used = false;
  powerups.doublejump.max_frames = 20;
  
  // animation properties
  powerups.doublejump.img = imageset.load("images/powerup_effect_doublejump.png");  
  powerups.doublejump.sprite_size = 8;  
  powerups.doublejump.sprite_offset_x = 4;
  powerups.doublejump.sprite_offset_y = 13;
  
  // Double Jump becomes a sustained booster
  powerups.booster = new Object();
  powerups.booster.acquired = false;
 
  // Drill power
  powerups.drill = new Object();
  powerups.drill.img = imageset.load("images/powerup_effect_drill.png");
  powerups.drill.acquired = true;
  powerups.drill.power = 0;
  powerups.drill.power_max = 32;
  powerups.drill.strike = false;
  powerups.drill.frames_left = [{x:0, y:8}, {x:8, y:8}, {x:16, y:8}, {x:24, y:8}];
  powerups.drill.frames_right = [{x:0, y:0}, {x:8, y:0}, {x:16, y:0}, {x:24, y:0}];
}

powerups.drill_engage = function() {
  powerups.drill.power++;
  if (powerups.drill.power >= powerups.drill.power_max) {
    powerups.drill.strike = true;
  }
}

powerups.drill_disengage = function() {
  if (powerups.drill.power > powerups.drill.power_max) powerups.drill.power = powerups.drill.power_max;
  powerups.drill.power-=4;
  if (powerups.drill.power <= 0) powerups.drill.power = 0;
}

powerups.acquire_jump = function() {
   powerups.jump.acquired = true;
}

powerups.acquire_doublejump = function() {
   powerups.doublejump.acquired = true; 
}

powerups.acquire_booster = function() {
   powerups.booster.acquired = true;
   powerups.doublejump.max_frames = 1000;   
}

powerups.render_doublejump = function(x,y) {
  
  // render a random frame 
  var src_x;
  if (Math.random() < 0.5) src_x = 0;
  else src_x = powerups.doublejump.sprite_size;
  
  // place the visual effect under the rover  
  var dest_x = Math.floor(x + powerups.doublejump.sprite_offset_x);
  var dest_y = Math.floor(y + powerups.doublejump.sprite_offset_y);

  imageset.render(
    powerups.doublejump.img,
	src_x, 0,
	powerups.doublejump.sprite_size,
	powerups.doublejump.sprite_size,
	dest_x, dest_y);
  
}

powerups.render_drill = function(x, y, facing) {
  
  var src_x, src_y;
  var dest_x, dest_y;
  var anim_frame = Math.floor((powerups.drill.power/3) % 4);
  
  if (facing == FACING_LEFT) {
    src_x = powerups.drill.frames_left[anim_frame].x;
    src_y = powerups.drill.frames_left[anim_frame].y;
    dest_x = x+1 - Math.min(powerups.drill.power/4, 8);
  }
  else if (facing == FACING_RIGHT) {
    src_x = powerups.drill.frames_right[anim_frame].x;
    src_y = powerups.drill.frames_right[anim_frame].y;    
    dest_x = x+6 + Math.min(powerups.drill.power/4, 8);
  }
  dest_y = y + 5;
  
  imageset.render(powerups.drill.img, src_x, src_y, 8, 8, dest_x, dest_y);
}

