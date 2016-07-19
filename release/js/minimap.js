/**
 Map handling
 */
 
var minimap = new Object();

minimap.init = function() {

  minimap.hud_img = imageset.load("images/minimap_static.png");
    
}

minimap.render = function() {

  imageset.render(
    minimap.hud_img,
	0,0,
	31,21,
	93,4
  );
}
