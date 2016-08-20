/**
 Display messages
 */

var message = new Object();

message.init = function() {
  message.visible = false;
  message.txt = "";
}

message.set_message = function(msg) {
  message.txt = msg;
  message.visible = true;
}

message.clear_message = function() {
  message.txt = "";
  message.visible = false;
}

message.render_message = function() {
  if (!message.visible) return;
  bitfont.render(message.txt, 64, 36, bitfont.JUSTIFY_CENTER);
}