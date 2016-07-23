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
  
  particles.info[particles.SPARK] = new Object();
  particles.info[particles.SPARK].size = 1;
  particles.info[particles.SPARK].frame_count = 3;
  particles.info[particles.SPARK].frame_duration = 30;
  particles.info[particles.SPARK].looping = false;
  particles.info[particles.SPARK].frame = [];
  particles.info[particles.SPARK].frame[0] = {x:1, y:1};
  particles.info[particles.SPARK].frame[1] = {x:5, y:1};
  particles.info[particles.SPARK].frame[2] = {x:9, y:1};
  particles.info[particles.SPARK].dx_radius = 2;
  particles.info[particles.SPARK].dy_radius = 2;
  
  particles.info[particles.WHEEL] = new Object();
  particles.info[particles.WHEEL].size = 7;
  particles.info[particles.WHEEL].frame_count = 8;
  particles.info[particles.WHEEL].frame_duration = 4;
  particles.info[particles.WHEEL].looping = true;
  particles.info[particles.WHEEL].frame = [];
  particles.info[particles.WHEEL].frame[0] = {x:1, y:5};
  particles.info[particles.WHEEL].frame[1] = {x:9, y:5};
  particles.info[particles.WHEEL].frame[2] = {x:17, y:5};
  particles.info[particles.WHEEL].frame[3] = {x:25, y:5};
  particles.info[particles.WHEEL].frame[4] = {x:33, y:5};
  particles.info[particles.WHEEL].frame[5] = {x:41, y:5};
  particles.info[particles.WHEEL].frame[6] = {x:49, y:5};
  particles.info[particles.WHEEL].frame[7] = {x:57, y:5};  
  particles.info[particles.WHEEL].dx_radius = 2;
  particles.info[particles.WHEEL].dy_radius = 2;
  
  
  particles.plist = [];
  
  // should probably match rover.gravity_acceleration
  particles.gravity_acceleration = 0.1;
}

particles.add = function(type, x, y) {
  var p = new Object();
  var info = particles.info[type];
  p.type = type;
  p.x = x - info.size/2;
  p.y = y - info.size/2;
  
  p.dx = (Math.random() * 2 * info.dx_radius) - info.dx_radius;
  p.dy = (Math.random() * 2 * info.dy_radius) - info.dy_radius;
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
  p.dy += particles.gravity_acceleration;  
}

particles.move = function(pid) {
  var p = particles.plist[pid];
  p.x += p.dx;
  p.y += p.dy;
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
	Math.floor(p.x),
    Math.floor(p.y)
  );
}
