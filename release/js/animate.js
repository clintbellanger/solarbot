/* General animation functions */

var animate = {};

var Animation = function(frame, speed, max, looping) {
  return {frame:frame, speed:speed, max:max, looping:looping};
}

animate.advance = function(anim) {
  
  var new_frame = anim.frame + anim.speed;
  
  if (anim.looping) {
    if (anim.speed > 0) {
      if (new_frame >= anim.max) new_frame -= anim.max;
    }
    else if (anim.speed < 0) {
	  if (new_frame < 0) new_frame += anim.max;
	}
  }
  
  anim.frame = new_frame;
    
}
