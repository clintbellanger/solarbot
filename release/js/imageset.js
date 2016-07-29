/**
 Handle images
 */
 
var imageset = new Object();

imageset.init = function() {
  
  imageset.list = new Array();
  imageset.loaded = 0;
  imageset.filenames = new Array();
  
  // TODO: split to Camera class
  imageset.offset_x = 0;
  imageset.offset_y = 0;
  imageset.shaking = 0;
  imageset.vibrating = 0;
  imageset.shake_radius = 4;
  imageset.vibrate_radius = 1;
  imageset.freeze_frames = 0;
}

/**
 * Load filename
 * Return unique ID
 */
imageset.load = function(filename) {
  
  // has this image already been loaded?
  // Don't load it again! Just return its id
  var check_id = imageset.get_index(filename);
  if (check_id > -1) return check_id;
  
  // set up a new image
  var new_img = new Image();
  new_img.src = filename;
  new_img.onload = function() {imageset.onload();};
  imageset.list.push(new_img);
  
  // remember this filename so we don't reload it later
  imageset.filenames.push(filename);
  
  // the last image in the list is the new one
  return (imageset.list.length -1);
}

/**
 * Lookup the array index for the given image filename
 * If that image has not been loaded, returns -1
 */
imageset.get_index = function(filename) {
  return (imageset.filenames.indexOf(filename));
}

imageset.onload = function() {
  imageset.loaded++;
}

imageset.logic = function() {
  if (imageset.shaking > 0) {
    imageset.shaking--;    
    imageset.offset_x = Math.floor(Math.random() * 2 * imageset.shake_radius) - imageset.shake_radius;
    imageset.offset_y = Math.floor(Math.random() * 2 * imageset.shake_radius) - imageset.shake_radius;
  }
  else if (imageset.vibrating > 0) {
    imageset.vibrating--;    
    imageset.offset_x = Math.floor(Math.random() * 2 * imageset.vibrate_radius) - imageset.vibrate_radius;
    imageset.offset_y = Math.floor(Math.random() * 2 * imageset.vibrate_radius) - imageset.vibrate_radius;
  }  
  else {
    imageset.offset_x = 0;
    imageset.offset_y = 0;
  }
}

imageset.render = function(img_id, src_x, src_y, src_w, src_h, dest_x, dest_y) {

  if (imageset.loaded < imageset.list.length) return;
  
  ctx.drawImage(
    imageset.list[img_id],
    src_x,
    src_y,
    src_w,
    src_h,
    (imageset.offset_x + dest_x) * SCALE,
    (imageset.offset_y + dest_y) * SCALE,
    src_w * SCALE,
    src_h * SCALE
  );
  
}
