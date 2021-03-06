/**
 Primary game state switcher
 
 */

var STATE_EXPLORE = 1;
var STATE_DEAD = 2;

var gamestate = STATE_EXPLORE;

function gamestate_logic() {

  // do this once per frame instead of anytime / multiple times during the loop
  if (touch_moved) recheckVirtualButtons();  
  touch_moved = false;

  // halt all game logic (used for hit stun emphasis)
  if (imageset.freeze_frames > 0) {
    imageset.freeze_frames--;
    return;
  }
  
  switch(gamestate) {
    case STATE_EXPLORE:
      rover.logic();
      bots.logic();
      imageset.logic();
      battery.logic();
      pickups.logic();
      particles.logic();
      touchbuttons.logic();
      
      if (rover.died) gamestate = STATE_DEAD;
      
      break;
      
    case STATE_DEAD:    
      rover.dead_logic();
      bots.logic();
      imageset.logic();
      battery.logic();
      particles.logic();
      
      break;
  } 
}

function gamestate_render() {

  clear_canvas("#222034");

  switch(gamestate) {
  
    case STATE_EXPLORE:
      labyrinth.draw_room();
	  bots.render();
      rover.render();      
      pickups.render();
      particles.render();
      lighting.render();
      battery.render();
      minimap.render();
      touchbuttons.render();
      messages.render_message();
      break;
      
    case STATE_DEAD:
      labyrinth.draw_room();
      rover.dead_render();
      bots.render();
      pickups.render();
      particles.render();
      lighting.render();
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


