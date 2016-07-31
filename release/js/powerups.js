

var powerups = new Object();

powerups.init = function() {

  powerups.doublejump = new Object();
  // usage properties
  powerups.doublejump.acquired = true;
  powerups.doublejump.used = false;
  powerups.doublejump.max_frames = 1000;
  
  // animation properties
  powerups.doublejump.img = imageset.load("images/powerup_effect_doublejump.png");  
  powerups.doublejump.sprite_size = 8;  
  powerups.doublejump.sprite_offset_x = 4;
  powerups.doublejump.sprite_offset_y = 13;
  
  
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
