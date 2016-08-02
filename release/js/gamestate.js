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
      imageset.logic();
      battery.logic();
	  pickups.logic();
      particles.logic();
      
      if (rover.died) gamestate = STATE_DEAD;
      
      break;
      
    case STATE_DEAD:    
      rover.dead_logic();
      imageset.logic();
      battery.logic();
      particles.logic();
      
      break;
  } 
}

function gamestate_render() {

  clear_canvas("#272c4a");

  switch(gamestate) {
  
    case STATE_EXPLORE:
      labyrinth.draw_room();
      particles.render();
      rover.render();	  
      battery.render();
      minimap.render();
      
      break;
      
    case STATE_DEAD:
      labyrinth.draw_room();
      rover.dead_render();      
      particles.render();
      battery.render();
      minimap.render();
      
      if (pressing.escape && !input_lock.escape) {
        input_lock.escape = true;
        gamestate = STATE_EXPLORE;
        reset_game();        
      }
      
      break;
  }
}


