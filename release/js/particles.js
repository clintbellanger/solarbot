/**
 Simple particle effects
 Intentional limits:
 - no translucent alpha
 - stay on pixels
 - stay on palette
*/

var particles = new Object();

particles.init = function() {
  
  particles.plist = []; // the current list of living particles
  particles.img = imageset.load("images/particles.png");
  
  particles.info = [];
  particles.SPARK = 1;
  particles.WHEEL = 2;
  particles.SMOKE = 3;
  
  particles.info[particles.SPARK] = new Object();
  var spark = particles.info[particles.SPARK];  
  spark.size = 1;
  spark.half = 0;  
  spark.frame_count = 3;
  spark.frame_duration = 30;
  spark.looping = false;
  spark.gravity = 0.1;
  spark.frame = [];
  spark.frame[0] = {x:1, y:1};
  spark.frame[1] = {x:5, y:1};
  spark.frame[2] = {x:9, y:1};
  
  particles.info[particles.WHEEL] = new Object();
  var wheel = particles.info[particles.WHEEL];  
  wheel.size = 6;
  wheel.half = 3;
  wheel.frame_count = 8;
  wheel.frame_duration = 6;
  wheel.looping = true;
  wheel.gravity = 0.1;
  wheel.frame = [];
  wheel.frame[0] = {x:1, y:5};
  wheel.frame[1] = {x:9, y:5};
  wheel.frame[2] = {x:17, y:5};
  wheel.frame[3] = {x:25, y:5};
  wheel.frame[4] = {x:33, y:5};
  wheel.frame[5] = {x:41, y:5};
  wheel.frame[6] = {x:49, y:5};
  wheel.frame[7] = {x:57, y:5};
  
  particles.info[particles.SMOKE] = new Object();
  var smoke = particles.info[particles.SMOKE];
  smoke.size = 8;
  smoke.half = 4;
  smoke.frame_count = 8;
  smoke.frame_duration = 4;
  smoke.looping = false;
  smoke.gravity = -0.01; // float up
  smoke.frame = [];
  smoke.frame[0] = {x:0, y:12};
  smoke.frame[1] = {x:8, y:12};
  smoke.frame[2] = {x:16, y:12};
  smoke.frame[3] = {x:24, y:12};
  smoke.frame[4] = {x:32, y:12};
  smoke.frame[5] = {x:40, y:12};
  smoke.frame[6] = {x:48, y:12};
  smoke.frame[7] = {x:56, y:12};         
  
}

particles.reset = function() {
 particles.plist = []; 
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
  p.finished_animation = false;
  particles.plist.push(p);
}

particles.remove = function(pid) {
  particles.plist.splice(pid,1);
}

particles.logic = function() {

  // backwards because we remove() does splicing
  for (var i=particles.plist.length-1; i>=0; i--) {
  
    particles.apply_gravity(i);
    particles.move(i);
    particles.animate(i);
        
    if (particles.below_view(i) || particles.plist[i].finished_animation) {
      particles.remove(i);
    }
  }
  
}

particles.animate = function(pid) {
  var p = particles.plist[pid];
  var info = particles.info[p.type];
  p.frame++;
  if (p.frame >= info.frame_count * info.frame_duration) {
    if (info.looping) p.frame = 0;
    else p.finished_animation = true;
  }  
}

particles.apply_gravity = function(pid) {
  var p = particles.plist[pid];
  
  // each particle having its own gravity allows
  // particles not influenced by gravity (gravity=0)
  // and particles that float upward (gravity<0)
  p.dy += particles.info[p.type].gravity;  
}

/**
 Move particles (x,y) by their current speed (dx,dy)
 If this puts the particle in a solid tile, move back
 then invert the speed to bounce in the opposite direction.
 */
particles.move = function(pid) {
  var p = particles.plist[pid];  

  
  // TODO: give each particle its own bounce dampen?
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

/**
 Checks for particles that fall off the bottom due to gravity.
 */
particles.below_view = function(pid) {
  var p = particles.plist[pid];
  if (p.x + p.size > VIEW_HEIGHT) {
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

/**************************************
 Particle Presets 
 Certain game moments have specific kinds of particle effects
 Sets initial positions and velocities of particles, with randomization
 *************************************/
 
/**
 Send sparks in random directions from the given area
 */
particles.preset_sparks_area = function(bounding_box, number_of_particles) {  

  var x, y, dx, dy;
  
  for (var i=0; i<number_of_particles; i++) {  
    x = random_between(bounding_box.x, bounding_box.x + bounding_box.w);
    y = random_between(bounding_box.y, bounding_box.y + bounding_box.h);
    dx = random_between(-4, 4);   
    dy = random_between(-4, 4);
    particles.add(particles.SPARK,x,y,dx,dy);
  }
  
}

particles.preset_smoke_area = function(bounding_box, number_of_particles) {  

  var x, y, dx, dy;
  
  for (var i=0; i<number_of_particles; i++) {  
    x = random_between(bounding_box.x, bounding_box.x + bounding_box.w);
    y = random_between(bounding_box.y, bounding_box.y + bounding_box.h);
    dx = random_between(-0.25, 0.25);   
    dy = random_between(-0.5, 0);
    particles.add(particles.SMOKE,x,y,dx,dy);
  }
  
}

/**
 Sparks fly nearly straight down, used for double jump thrusters
 */
particles.preset_sparks_thrust = function(x, y, rover_dx, rover_dy) {
 
  var dx = random_between(-0.5, 0.5);
  var dy = random_between(1, 4);
    
  // influence by current rover speed
  dx += rover_dx/2;
  dy += rover_dy/2;
    
  particles.add(particles.SPARK,x,y,dx,dy);
}

particles.preset_smoke_thrust = function(x, y, rover_dx, rover_dy) {

  var dx = random_between(-0.25, 0.25);
  var dy = random_between(0.8, 1.2);
    
  // influence by current rover speed
  dx += rover_dx/2;
  dy += rover_dy/2;
    
  particles.add(particles.SMOKE,x,y,dx,dy);
}
