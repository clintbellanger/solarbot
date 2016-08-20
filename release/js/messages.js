/**
 Display messages
 */

var messages = {};

messages.init = function() {
  messages.visible = false;
  messages.text = "";
}

messages.set_message = function(msg) {
  messages.text = msg;
  messages.visible = true;
}

messages.clear_message = function() {
  messages.text = "";
  messages.visible = false;
}

messages.render_message = function() {
  if (!messages.visible) return;
  bitfont.render(messages.text, 64, 36, bitfont.JUSTIFY_CENTER);
}