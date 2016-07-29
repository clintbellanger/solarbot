/**
 Simple particle effects
 Intentional limits:
 - no translucent alpha
 - stay on pixels
 - stay on palette
*/

var particles = new Object();

particles.init = function() {
  
  particles.img = imageset.load("images/particles.png");
  
  particles.info = [];
  particles.SPARK = 1;
  particles.WHEEL = 2;
  particles.SMOKE = 3;
  
  particles.info[particles.SPARK] = new Object();
  particles.info[particles.SPARK].size = 1;
  particles.info[particles.SPARK].half = 0;  
  particles.info[particles.SPARK].frame_count = 3;
  particles.info[particles.SPARK].frame_duration = 30;
  particles.info[particles.SPARK].looping = false;
  particles.info[particles.SPARK].gravity = 0.1;
  particles.info[particles.SPARK].frame = [];
  particles.info[particles.SPARK].frame[0] = {x:1, y:1};
  particles.info[particles.SPARK].frame[1] = {x:5, y:1};
  particles.info[particles.SPARK].frame[2] = {x:9, y:1};
  
  particles.info[particles.WHEEL] = new Object();
  particles.info[particles.WHEEL].size = 6;
  particles.info[particles.WHEEL].half = 3;
  particles.info[particles.WHEEL].frame_count = 8;
  particles.info[particles.WHEEL].frame_duration = 6;
  particles.info[particles.WHEEL].looping = true;
  particles.info[particles.WHEEL].gravity = 0.1;
  particles.info[particles.WHEEL].frame = [];
  particles.info[particles.WHEEL].frame[0] = {x:1, y:5};
  particles.info[particles.WHEEL].frame[1] = {x:9, y:5};
  particles.info[particles.WHEEL].frame[2] = {x:17, y:5};
  particles.info[particles.WHEEL].frame[3] = {x:25, y:5};
  particles.info[particles.WHEEL].frame[4] = {x:33, y:5};
  particles.info[particles.WHEEL].frame[5] = {x:41, y:5};
  particles.info[particles.WHEEL].frame[6] = {x:49, y:5};
  particles.info[particles.WHEEL].frame[7] = {x:57, y:5};
  
  particles.info[particles.SMOKE] = new Object();
  particles.info[particles.SMOKE].size = 8;
  particles.info[particles.SMOKE].half = 4;
  particles.info[particles.SMOKE].frame_count = 8;
  particles.info[particles.SMOKE].frame_duration = 4;
  particles.info[particles.SMOKE].looping = false;
  particles.info[particles.SMOKE].gravity = -0.01; // float up
  particles.info[particles.SMOKE].frame = [];
  particles.info[particles.SMOKE].frame[0] = {x:0, y:12};
  particles.info[particles.SMOKE].frame[1] = {x:8, y:12};
  particles.info[particles.SMOKE].frame[2] = {x:16, y:12};
  particles.info[particles.SMOKE].frame[3] = {x:24, y:12};
  particles.info[particles.SMOKE].frame[4] = {x:32, y:12};
  particles.info[particles.SMOKE].frame[5] = {x:40, y:12};
  particles.info[particles.SMOKE].frame[6] = {x:48, y:12};
  particles.info[particles.SMOKE].frame[7] = {x:56, y:21};   
  
  
  particles.plist = [];
  
}

particles.reset = function() {
 particles.plist = []; 
}

/**
 Send sparks in random directions from the given area
 */
particles.preset_sparks_area = function(bounding_box, number_of_particles) {  

  var x;
  var y;
  var dx;
  var dy;  
  
  for (var i=0; i<number_of_particles; i++) {  
    x = random_between(bounding_box.x, bounding_box.x + bounding_box.w);
    y = random_between(bounding_box.y, bounding_box.y + bounding_box.h);
    dx = random_between(-4, 4);   
    dy = random_between(-4, 4);
    particles.add(particles.SPARK,x,y,dx,dy);
  }
  
}

/**
 Sparks fly nearly straight down, used for double jump thrusters
 */
particles.preset_sparks_thrust = function(x, y, rover_dx, rover_dy, number_of_particles) {
 
  var dx;
  var dy;
  
  for (var i=0; i<number_of_particles; i++) {  
    dx = random_between(-0.5, 0.5);
    dy = random_between(1, 4);
    
    // influence by current rover speed
    dx += rover_dx/2;
    dy += rover_dy/2;
    
    particles.add(particles.SPARK,x,y,dx,dy);
  } 
}

particles.preset_smoke = function(x, y, influence_dx, influence_dy, number_of_particles) {
  var dx;
  var dy;
  
  for (var i=0; i<number_of_particles; i++) {  
    dx = random_between(-0.1, 0.1);
    dy = random_between(0.8, 1.2);
    
    // influence by current rover speed
    dx += influence_dx/2;
    dy += influence_dy/2;
    
    particles.add(particles.SMOKE,x,y,dx,dy);
  } 
}

particles.add = function(type, x, y, dx, dy) {
  var p = new Object();
  var info = particles.info[type];
  p.type = type;
  p.x = x;
  p.y = y;
  p.dx = dx;
  p.dy = dy;
  p.frame = 0;
  particles.plist.push(p);
}

particles.remove = function(pid) {
  particles.plist.splice(pid,1);
}

particles.logic = function() {

  // backwards because we may splice
  for (var i=particles.plist.length-1; i>=0; i--) {
	particles.apply_gravity(i);
	particles.move(i);
	
	// both leave screen and animate may remove()
	// so don't double-remove
	if (!particles.leave_screen(i)) {
      particles.animate(i);
	}
  }
  
}

particles.animate = function(pid) {
  var p = particles.plist[pid];
  var info = particles.info[p.type];
  p.frame++;
  if (p.frame >= info.frame_count * info.frame_duration) {
    if (info.looping) p.frame = 0;
	else particles.remove(pid);
  }  
}

particles.apply_gravity = function(pid) {
  var p = particles.plist[pid];
  p.dy += particles.info[p.type].gravity;  
}

particles.move = function(pid) {
  var p = particles.plist[pid];  

  p.y += p.dy;  
  if (collision.pixelHasCollision(p.x, p.y)) {
    p.y -= p.dy;
	p.dy = -0.9 * p.dy; // bounce and dampen
  }
  
  p.x += p.dx;
  if (collision.pixelHasCollision(p.x, p.y)) {
    p.x -= p.dx;
	p.dx = -0.9 * p.dx; // bounce and dampen
  }
  
}

particles.leave_screen = function(pid) {
  var p = particles.plist[pid];
  if (p.x + p.size > VIEW_HEIGHT) {
    particles.remove(pid);
	return true;
  }
  return false;
}

particles.render = function() {
  for (var i=particles.plist.length-1; i>=0; i--) {
    particles.render_single(i);
  }
}

particles.render_single = function(pid) {
  var p = particles.plist[pid];
  var info = particles.info[p.type];
  var f = Math.floor(p.frame / info.frame_duration);
  
  imageset.render(
    particles.img,
	  info.frame[f].x, info.frame[f].y,
	  info.size, info.size,
  	Math.floor(p.x) - info.half,
    Math.floor(p.y) - info.half
  );
}
