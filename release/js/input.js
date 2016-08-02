/**
Basic input handling.
Use these lines in the init() function to enable:
  window.addEventListener('keydown', handleKeyDown, true);
  window.addEventListener('keyup', handleKeyUp, true);

2013 Clint Bellanger
*/

//---- Key States ---------------------------------------------------

var pressing = new Object();
pressing.up = false;
pressing.down = false;
pressing.left = false;
pressing.right = false;
pressing.action = false;
pressing.mouse = false;
pressing.escape = false;

var input_lock = new Object();
input_lock.up = false;
input_lock.down = false;
input_lock.left = false;
input_lock.right = false;
input_lock.action = false;
input_lock.mouse = false;
input_lock.escape = false;

var mouse_pos = {x:0, y:0};

var virtual_buttons = new Object();

// bleed over canvas by 1 tile size, helps with touching edges
virtual_buttons.left = {x:-16, y:80, w:80, h:64};
virtual_buttons.right = {x:64, y:80, w:80, h:64};
virtual_buttons.up = {x:-16, y:32, w:160, h:48};



//---- Key Bindings -------------------------------------------------

var KEYCODE_UP     = 38; // arrow up
var KEYCODE_DOWN   = 40; // arrow down
var KEYCODE_LEFT   = 37; // arrow left
var KEYCODE_RIGHT  = 39; // arrow right
var KEYCODE_ACTION = 32; // space
var KEYCODE_ESCAPE = 27; // esc

// secondary
var ALTCODE_UP     = 87; // w
var ALTCODE_DOWN   = 83; // s
var ALTCODE_LEFT   = 65; // a
var ALTCODE_RIGHT  = 68; // d
var ALTCODE_ACTION = 90; // z
var ALTCODE_ESCAPE =  9; // tab

//---- Input Functions ----------------------------------------------

function handleKeyDown(evt) {

  evt.preventDefault();

  if (evt.keyCode == KEYCODE_UP || evt.keyCode == ALTCODE_UP) {
    pressing.up = true;
  }
  else if (evt.keyCode == KEYCODE_DOWN || evt.keyCode == ALTCODE_DOWN) {
    pressing.down = true;
  }
  else if (evt.keyCode == KEYCODE_LEFT || evt.keyCode == ALTCODE_LEFT) {
    pressing.left = true;
  }
  else if (evt.keyCode == KEYCODE_RIGHT || evt.keyCode == ALTCODE_RIGHT) {
    pressing.right = true;
  }
  else if (evt.keyCode == KEYCODE_ACTION || evt.keyCode == ALTCODE_ACTION) {
    //pressing.action = true;
	// reuse action as extra jump options
	pressing.up = true;
  }
  else if (evt.keyCode == KEYCODE_ESCAPE || evt.keyCode == ALTCODE_ESCAPE) {
	pressing.escape = true;
  }
  
}

function handleKeyUp(evt) {

  if (evt.keyCode == KEYCODE_UP || evt.keyCode == ALTCODE_UP) {
    pressing.up = false;
	input_lock.up = false;
  }
  else if (evt.keyCode == KEYCODE_DOWN || evt.keyCode == ALTCODE_DOWN) {
    pressing.down = false;
	input_lock.down = false;
  }
  else if (evt.keyCode == KEYCODE_LEFT || evt.keyCode == ALTCODE_LEFT) {
    pressing.left = false;
	input_lock.left = false;
  }
  else if (evt.keyCode == KEYCODE_RIGHT || evt.keyCode == ALTCODE_RIGHT) {
    pressing.right = false;
	input_lock.right = false;
  }
  else if (evt.keyCode == KEYCODE_ACTION || evt.keyCode == ALTCODE_ACTION) {
    //pressing.action = false;
	//input_lock.action = false;
    pressing.up = false;
	input_lock.up = false;	
  }
  else if (evt.keyCode == KEYCODE_ESCAPE || evt.keyCode == ALTCODE_ESCAPE) {
	pressing.escape = false;
	input_lock.escape = false;
  }
}

function handleMouseDown(evt) {
  evt.preventDefault();
  pressing.mouse = true;
  mouse_pos = clickCoord(evt);
  simulatePress();
}

function handleMouseUp(evt) {
  pressing.mouse = false;
  input_lock.mouse = false;
  simulateRelease();
}

function clickCoord(evt) {

  var canx;
  var cany;
  
  if (evt.pageX || evt.pageY) { 
    canx = evt.pageX;
    cany = evt.pageY;
  }
  else { 
    canx = evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
    cany = evt.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
  } 
  canx -= can.offsetLeft;
  cany -= can.offsetTop;
  
  canx /= SCALE;
  cany /= SCALE;
  
  return {x:canx, y:cany};
}

/** Touch Handler **/
// multi-touch heavily borrowing from:
// https://developer.mozilla.org/en-US/docs/Web/API/Touch_events#Example

var ongoingTouches = new Array();

function handleTouchStart(evt) {
  evt.preventDefault();
  var touches = evt.changedTouches;
  
  for (var i=0; i < touches.length; i++) {
    ongoingTouches.push(copyTouch(touches[i]));
	touchVirtualButtonPress(touches[i]);
  }
}

function handleTouchEnd(evt) {
  evt.preventDefault();
  var touches = evt.changedTouches;
  var index;
  
  for (var i=0; i<touches.length; i++) {
    index = ongoingTouchById(touches[i].identifier);
	if (index >= 0) {
	  touchVirtualButtonRelease(ongoingTouches[index]);
	  ongoingTouches.splice(index, 1);
	}
  }
}

function copyTouch(touch) {
  return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
}

function ongoingTouchById(idToFind) {
  for (var i = 0; i < ongoingTouches.length; i++) {
    var id = ongoingTouches[i].identifier;
    
    if (id == idToFind) {
      return i;
    }
  }
  return -1;    // not found
}

/** end multi-touch example from Mozilla **/

function touchCoord(pageX, pageY) {
  var canx = pageX - can.offsetLeft;
  var cany = pageY - can.offsetTop;
  
  canx /= SCALE;
  cany /= SCALE;
  
  return {x:canx, y:cany};
}

function touchVirtualButtonPress(touchEvt) {
  touch_pos = touchCoord(touchEvt.pageX, touchEvt.pageY);
  
  if (collision.isWithin(touch_pos, virtual_buttons.left)) {
    pressing.left = true;
  }
  if (collision.isWithin(touch_pos, virtual_buttons.right)) {
    pressing.right = true;
  }
  if (collision.isWithin(touch_pos, virtual_buttons.up)) {
    pressing.up = true;
  }
}

function touchVirtualButtonRelease(touchEvt) {
  touch_pos = touchCoord(touchEvt.pageX, touchEvt.pageY);
  
  if (collision.isWithin(touch_pos, virtual_buttons.left)) {
    pressing.left = false;
    input_lock.left = false;
  }
  if (collision.isWithin(touch_pos, virtual_buttons.right)) {	  
    pressing.right = false;
    input_lock.right = false;
  }
  if (collision.isWithin(touch_pos, virtual_buttons.up)) {
    pressing.up = false;
    input_lock.up = false;
  }
}

// rougher mouse version
function simulatePress() {
  if (mouse_pos.y > VIEW_HEIGHT/2) {
    if (mouse_pos.x < VIEW_WIDTH/2) {
      pressing.left = true;
    }
    else if (mouse_pos.x >= VIEW_WIDTH/2) {
      pressing.right = true;
    }
  }
  else {
    pressing.up = true;
  }
}

function simulateRelease() {
  pressing.left = false;
  pressing.right = false;
  pressing.up = false;
  input_lock.left = false;
  input_lock.right = false;
  input_lock.up = false;
}
