/**
 Visual overlay buttons for touch support
 */
 
var touchbuttons = new Object();

touchbuttons.init = function() {

  touchbuttons.left = new Object();
  touchbuttons.right = new Object();
  touchbuttons.up = new Object();
  
  touchbuttons.left.img  = imageset.load("images/touch_left.png");
  touchbuttons.right.img = imageset.load("images/touch_right.png");
  touchbuttons.up.img    = imageset.load("images/touch_up.png");
  
  touchbuttons.left.area =  {x: 0, y:96, w:32, h:32};
  touchbuttons.right.area = {x:32, y:96, w:32, h:32};
  touchbuttons.up.area =    {x:96, y:96, w:32, h:32};
  
  touchbuttons.left.offset_y = 0;
  touchbuttons.right.offset_y = 0;
  touchbuttons.up.offset_y = 0;
  
  touchbuttons.left.visible = false;
  touchbuttons.right.visible = false;
  touchbuttons.up.visible = false;
  
}

touchbuttons.logic = function() {

  if (!touch_detected) return;
  
  touchbuttons.left.visible = true;
  touchbuttons.right.visible = true;
    
  if (powerups.jump.acquired) {
    touchbuttons.up.visible = true;
  }
  
  if (pressing.left) touchbuttons.left.offset_y = 2;
  else touchbuttons.left.offset_y = 0;

  if (pressing.right) touchbuttons.right.offset_y = 2;
  else touchbuttons.right.offset_y = 0;

  if (pressing.up) touchbuttons.up.offset_y = 2;
  else touchbuttons.up.offset_y = 0;
  
}

touchbuttons.render = function() {
  touchbuttons.render_button(touchbuttons.left);
  touchbuttons.render_button(touchbuttons.right);
  touchbuttons.render_button(touchbuttons.up);
}

touchbuttons.render_button = function(bt) {
  if (!bt.visible) return;

  imageset.render(
    bt.img,
    0,0,
    bt.area.w, bt.area.h,
    bt.area.x, bt.area.y + bt.offset_y
  );
}
