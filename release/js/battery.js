/**
 Display and manage power level
 This is the health meter for the rover main character
 */
 
var battery = new Object();

battery.init = function() {

  // logic values
  battery.capacity = 8; // starting max amount of energy
  battery.charge = battery.capacity; // current amount of energy

  // display values
  battery.hud_img = imageset.load("images/battery_tiles.png");
  
  // screen position
  battery.top = 4;
  battery.left = 4;
  battery.bars_left = battery.left + 3;
  
  // battery sections
  battery.tile_top = {x:0, y:0, w:8, h:4};
  battery.tile_mid = {x:0, y:4, w:8, h:4};
  battery.tile_bot = {x:0, y:9, w:8, h:2};
  battery.bar_white = {x:9, y:1, w:2, h:2};
  battery.bar_gold = {x:9, y:3, w:2, h:2};
  battery.bar_red = {x:9, y:5, w:2, h:2};
    
  // animation properties
  // indicate the amount of health lost/gained
  battery.recent_charge = battery.charge;
  battery.recent_framecount = 0;
  battery.recent_framemax = 60;
  battery.recent_tick = 10;
}

battery.logic = function() {

  // fade indicator memory on the previous energy level
  if (battery.recent_framecount > 0) {
    battery.recent_framecount--;
	
	if (battery.recent_framecount == 0) {
	
	  if (battery.recent_charge > battery.charge) battery.recent_charge--;
	  else if (battery.recent_charge < battery.charge) battery.recent_charge++;
	  
	  if (battery.recent_charge != battery.charge) battery.recent_framecount = battery.recent_tick;
	  
	}
  }
}

battery.spend_energy = function(amount) {
  battery.recent_charge = battery.charge;  
  battery.charge -= amount;
  battery.recent_framecount = battery.recent_framemax;
  if (battery.charge < 0) battery.charge = 0;
}

battery.gain_energy = function(amount) {
  battery.recent_charge = battery.charge;  
  battery.charge += amount;
  battery.recent_framecount = battery.recent_framemax;
  if (battery.charge > battery.capacity) battery.charge = battery.capacity;
}


/**
 * The battery expands vertically as capacity increases
 */
battery.render = function() {

  var cursor_y = battery.top;
  
  // battery top
  imageset.render(
    battery.hud_img,
	battery.tile_top.x, battery.tile_top.y,
	battery.tile_top.w, battery.tile_top.h,
    battery.left, cursor_y
  );
  
  cursor_y += battery.tile_top.h;
  
  // repeating middle section, one part per 2 capacity bars
  for (var i=0; i<battery.capacity/2; i++) {

    imageset.render(
      battery.hud_img,
	  battery.tile_mid.x, battery.tile_mid.y,
  	  battery.tile_mid.w, battery.tile_mid.h,
      battery.left, cursor_y
    );
	cursor_y += battery.tile_mid.h;	
  }
  
  // battery bottom
  imageset.render(
    battery.hud_img,
	battery.tile_bot.x, battery.tile_bot.y,
	battery.tile_bot.w, battery.tile_bot.h,
    battery.left, cursor_y
  );
  
  // display number of bars, starting from bottom
  for (var bar_num = 0; bar_num < battery.charge; bar_num++) {

    cursor_y -= battery.bar_white.h;
	
    imageset.render(
      battery.hud_img,
	  battery.bar_white.x, battery.bar_white.y,
  	  battery.bar_white.w, battery.bar_white.h,
      battery.bars_left, cursor_y
    );
  }
  
  // we're done unless health has recently changed
  if (battery.recent_framecount == 0) return;
  
  // show recently lost health
  if (battery.recent_charge > battery.charge) {
    
	for (var b1 = battery.charge; b1 < battery.recent_charge; b1++) {
      cursor_y -= battery.bar_red.h;

      imageset.render(
        battery.hud_img,
	    battery.bar_red.x, battery.bar_red.y,
  	    battery.bar_red.w, battery.bar_red.h,
        battery.bars_left, cursor_y
      );
	}
  }
  // show recently gained health
  else if (battery.recent_charge < battery.charge) {

	for (var b2 = battery.charge; b2 > battery.recent_charge; b2--) {

      imageset.render(
        battery.hud_img,
	    battery.bar_gold.x, battery.bar_gold.y,
  	    battery.bar_gold.w, battery.bar_gold.h,
        battery.bars_left, cursor_y
      );
	  
      cursor_y += battery.bar_gold.h;	  
	}
  }

}
