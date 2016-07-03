/**
 Primary game state switcher
 
 */

var STATE_EXPLORE = 1;
 
var gamestate = STATE_EXPLORE;

function gamestate_logic() {

  switch(gamestate) {
    case STATE_EXPLORE:
	  rover.logic();
	  break;
  } 
}

function gamestate_render() {

  clear_canvas("#888888");

  switch(gamestate) {
  
    case STATE_EXPLORE:
      rover.render();
	  break;
  }
}


