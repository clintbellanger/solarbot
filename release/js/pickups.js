
var pickups = new Object();

pickups.init = function() {

  // pickup properties
  pickups.current_frame = 0;
  pickups.frame_count = 4;
  pickups.size = 16;
  
  pickups.img = imageset.load("images/powerup_jump_coil.png");
  
}

pickups.logic = function() {

  // animate
  pickups.current_frame += 0.2;
  if (pickups.current_frame >= pickups.frame_count) {
    pickups.current_frame = 0;
  }
}

pickups.render_icon = function(x, y) {
  
  imageset.render(
    pickups.img,
	  Math.floor(pickups.current_frame) * pickups.size , 0,
	  pickups.size,
	  pickups.size,
	  x, y);
}
