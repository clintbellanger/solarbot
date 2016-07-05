/**
 Display and manage power level
 */
 
var battery = new Object();

battery.init = function() {

  battery.hud_img = imageset.load("images/hud_battery.png");
}

battery.render = function() {

  imageset.render(
    battery.hud_img,
	0,0,
	8,16,
	4,4
  );
}