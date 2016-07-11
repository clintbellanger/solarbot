// click areas reusable by several modules
var clickarea_left = {x:0, y:20, w:40, h:100};
var clickarea_right = {x:120, y:20, w:40, h:100};
var clickarea_jump = {x:120, y:20, w:40, h:100};

function resizeCanvas() {
  if (!STRETCH_TO_SCREEN) {
    
	  can.width = VIEW_WIDTH * SCALE;
	  can.height = VIEW_HEIGHT * SCALE;
	  redraw = true;
	  setNearestNeighbor();
	  return;
  }

  var aspect_ratio = VIEW_WIDTH/VIEW_HEIGHT;
    
  // the screen is more wide than tall
  if (window.innerHeight * aspect_ratio < window.innerWidth) {  
    can.height = window.innerHeight;
    can.width = can.height * aspect_ratio;
    SCALE = can.height / VIEW_HEIGHT;
  }
  // the screen is more tall than wide
  else {
    can.width = window.innerWidth;
	can.height = can.width / aspect_ratio;
	SCALE = can.width / VIEW_WIDTH;
  }
  
  if (STRETCH_TO_WHOLE_SIZES) {
    if (SCALE > 1) {
      SCALE = Math.floor(SCALE);
    }
  }
  
  redraw = true;
  setNearestNeighbor();
}

function setNearestNeighbor() {
  ctx.imageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
  ctx.oImageSmoothingEnabled = false;  
}

/**
 * Generic cookie writer
 * Based on http://www.w3schools.com/js/js_cookies.asp
 */
function setCookie(c_name, value, exdays)
{
  var exdate=new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
  document.cookie=c_name + "=" + c_value;
}

/**
 * Generic cookie reader
 * Based on http://www.w3schools.com/js/js_cookies.asp
 */
function getCookie(c_name)
{
  var c_value = document.cookie;
  var c_start = c_value.indexOf(" " + c_name + "=");
  if (c_start == -1) {
    c_start = c_value.indexOf(c_name + "=");
  }
  if (c_start == -1) {
    c_value = null;
  }
  else {
    c_start = c_value.indexOf("=", c_start) + 1;
    var c_end = c_value.indexOf(";", c_start);
    if (c_end == -1) {
      c_end = c_value.length;
    }
    c_value = unescape(c_value.substring(c_start,c_end));
  }
  return c_value;
}

function clear_canvas(fillStyle) {
  ctx.fillStyle = fillStyle;
  ctx.fillRect(0, 0, VIEW_WIDTH * SCALE, VIEW_HEIGHT * SCALE);  
}
