/* General animation functions */

var animate = {};

var Animation = function(frame, speed, max, looping, multiply) {
  return {frame:frame, speed:speed, max:max, looping:looping, multiply:multiply};
}

animate.advance = function(anim) {
  var new_frame = anim.frame + (anim.speed * anim.multiply);  
  
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

animate.copy_anim = function(anim) {
  return {frame:anim.frame, speed:anim.speed, max:anim.max, looping:anim.looping, multiply:anim.multiply};
}