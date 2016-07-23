/**
 Primary game state switcher
 
 */

var STATE_EXPLORE = 1;
var STATE_DEAD = 2;

var gamestate = STATE_EXPLORE;

function gamestate_logic() {

  // halt all game logic (used for hit stun emphasis)
  if (imageset.freeze_frames > 0) {
    imageset.freeze_frames--;
	return;
  }

  switch(gamestate) {
    case STATE_EXPLORE:
      rover.logic();
      powerups.logic();
	  imageset.logic();
	  battery.logic();
      break;
  } 
}

function gamestate_render() {

  clear_canvas("#272c4a");

  switch(gamestate) {
  
    case STATE_EXPLORE:
      labyrinth.draw_room();
      rover.render();	  
      battery.render();
      minimap.render();
      break;
  }
}


