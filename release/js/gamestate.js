/**
 Primary game state switcher
 
 */

var STATE_EXPLORE = 1;
 
var gamestate = STATE_EXPLORE;

function gamestate_logic() {

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


