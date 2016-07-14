

var powerups = new Object();

powerups.init = function() {

  powerups.doublejump = new Object();
  // usage properties
  powerups.doublejump.acquired = true;
  powerups.doublejump.used = false;
  
  // animation properties
  powerups.doublejump.img = imageset.load("images/powerup_effect_doublejump.png");  
  powerups.doublejump.sprite_size = 8;  
  powerups.doublejump.sprite_offset_x = 4;
  powerups.doublejump.sprite_offset_y = 13;
  
  // pickup properties
  powerups.pickup_current_frame = 0;
  powerups.pickup_frame_count = 4;
  
  powerups.doublejump.pickup_img = imageset.load("images/powerup_jump_coil.png");
  powerups.doublejump.pickup_size = 16;
  
}

powerups.logic = function() {
  powerups.pickup_current_frame += 0.2;
  if (powerups.pickup_current_frame >= powerups.pickup_frame_count) {
    powerups.pickup_current_frame = 0;
  }
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

powerups.render_pickup = function(img_id, x, y) {
  console.log(Math.floor(powerups.pickup_current_frame));
  
  imageset.render(
    img_id,
	  Math.floor(powerups.pickup_current_frame) * powerups.doublejump.pickup_size , 0,
	  powerups.doublejump.pickup_size,
	  powerups.doublejump.pickup_size,
	  x, y);
}
