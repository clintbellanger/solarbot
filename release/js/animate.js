/* General animation functions */

var animate = {};

var Animation = function(frame, speed, max, looping) {
  return {frame:frame, speed:speed, max:max, looping:looping};
}

animate.advance = function(anim) {
  var new_frame = anim.frame + anim.speed;
  
  if (new_frame >= anim.max && anim.speed > 0) {
    if (anim.looping) {
      new_frame -= anim.max; // restart the animation
    }    
    else {
      new_frame = anim.max -1; // stay at last frame
    }
  }
  else if (new_frame < 0 && anim.speed < 0) {
    if (anim.ooping) {
      new_frame += anim.max // restart the animation      
    }
    else {
      new_frame = 0; // stay at first frame
    }
  }
  
  anim.frame = new_frame;
    
}

animate.copy_anim = function(anim) {
  return {frame:anim.frame, speed:anim.speed, max:anim.max, looping:anim.looping};
}