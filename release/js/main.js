// html elements
var can;     // canvas
var ctx;     // context
var FPS = 60;

// this style of game doesn't update visually often
// set this flag anytime the render function should update the view
var redraw = false;


//---- Logic Function ---------------------------------------------

function logic() {
  gamestate_logic();
}

//---- Render Function ---------------------------------------------

function render() {

  // only render if something has changed
  if (!redraw) return;
  redraw = false;
  
  gamestate_render();
}

//---- Init Function -----------------------------------------------

function init() {

  can = document.getElementById("gamecanvas");
  if (can.getContext) {
    ctx = can.getContext("2d");
  }

  resizeCanvas();
  setNearestNeighbor(); 
  
  if (window.addEventListener) {
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    window.addEventListener('mousedown', handleMouseDown, true);
    window.addEventListener('mouseup', handleMouseUp, true);
    window.addEventListener('touchstart', handleTouchStart, true);
    window.addEventListener('touchend', handleTouchEnd, true);
    window.addEventListener('touchmove', handleTouchMove, true);
    window.addEventListener('resize', resizeCanvas, false);
    window.addEventListener('orientationchange', resizeCanvas, false);
  }
  
  // load some user preferences
  //var json_save = getCookie("options");
  //if (json_save != null) {
  //  OPTIONS = JSON.parse(json_save);
  //}

  init_all();
  
  // TEMP set default map
  // TODO: set this during switch from title screen gamestate
  labyrinth.mapfile = "example";
  tiled.load_map(labyrinth.mapfile);
  rover.new_map_spawn();
  
  setInterval(function() {
    logic();
    render();
  }, 1000/FPS);
}

// initialize all game units
function init_all() {  
  imageset.init();
  bitfont.init();
  messages.init();
  tileset.init();
  pickups.init();
  bots.init();
  labyrinth.init();
  lighting.init();
  powerups.init();
  rover.init();  
  particles.init();
  touchbuttons.init();
  battery.init();
  minimap.init();
}

// initialize all game units changed during gameplay
function reset_game() {
  // imageset.init() skipped, we don't want to reload images
  // some other objects are essentially static
   
  messages.init();
  particles.init();
  pickups.init();
  bots.init();
  labyrinth.init();
  lighting.init();
  powerups.init();
  rover.init();
  touchbuttons.init();
  battery.init();
  minimap.init();
  tiled.load_map(labyrinth.mapfile);
  rover.new_map_spawn();

  gamestate = STATE_EXPLORE; // TODO: circular dependency?
}
