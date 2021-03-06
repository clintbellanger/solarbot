
var pickups = new Object();

pickups.init = function() {

  pickups.img = imageset.load("images/pickups.png");
  
  // each pickup type and info
  // this enum should match the items.png tileset order
  pickups.BATTERY = 0;
  pickups.JUMP = 1;
  pickups.MINIMAP = 2;
  pickups.DRILL = 3;
  pickups.DOUBLE_JUMP = 4;
  pickups.BOOSTER = 5;
  
  pickups.info = new Array();
  
  pickups.info[pickups.BATTERY] = new Object();
  pickups.info[pickups.BATTERY].frames = [{x:0, y:0}, {x:16, y:0}, {x:32, y:0}, {x:48, y:0}];
  pickups.info[pickups.BATTERY].name = "Battery Pack";
  
  pickups.info[pickups.JUMP] = new Object();
  pickups.info[pickups.JUMP].frames = [{x:0, y:16}, {x:16, y:16}, {x:32, y:16}, {x:48, y:16}];
  pickups.info[pickups.JUMP].name = "Jump Coil";
  
  pickups.info[pickups.DOUBLE_JUMP] = new Object();
  pickups.info[pickups.DOUBLE_JUMP].frames = [{x:0, y:64}, {x:16, y:64}, {x:32, y:64}, {x:48, y:64}];
  pickups.info[pickups.DOUBLE_JUMP].name = "Double Jump";
  
  pickups.info[pickups.BOOSTER] = new Object();
  pickups.info[pickups.BOOSTER].frames = [{x:0, y:80}, {x:16, y:80}, {x:32, y:80}, {x:48, y:80}];
  pickups.info[pickups.BOOSTER].name = "Rocket Booster";
  
  pickups.info[pickups.DRILL] = new Object();
  pickups.info[pickups.DRILL].frames = [{x:0, y:48}, {x:16, y:48}, {x:32, y:48}, {x:48, y:48}];
  pickups.info[pickups.DRILL].name = "Wall Drill";
  
  pickups.info[pickups.MINIMAP] = new Object();
  pickups.info[pickups.MINIMAP].frames = [{x:0, y:32}, {x:16, y:32}, {x:32, y:32}, {x:48, y:32}];
  pickups.info[pickups.MINIMAP].name = "Map Scanner";
  
  // shared animation properties
  pickups.current_frame = 0;
  pickups.frame_count = 4;
  pickups.size = 16;
  
  // one pickup can be on the screen at a time.
  // populate this data on room load
  pickups.on_screen = new Object();
  pickups.on_screen.available = false;
  pickups.on_screen.type = 0;
  pickups.on_screen.x = 0;
  pickups.on_screen.y = 0;
  pickups.on_screen.index = 0;

  // indexes of these two arrays match
  pickups.map_data = [];
  pickups.collected = [];
  
  pickups.init_map_data();

  // start the game with no pickups collected yet
  for (var i=0; i<pickups.map_data.length; i++) {
    pickups.collected[i] = false; 
  }

  
}

// this should be loaded from a map editor. For now keep it separate from init
pickups.init_map_data = function() {
  
  // where on the map each pickup is

  // example.tmx pickups
  pickups.map_data[0] = {type: pickups.JUMP, room_x:0, room_y: 0, tile_x: 1, tile_y: 6};
  pickups.map_data[1] = {type: pickups.BATTERY, room_x:3, room_y: 0, tile_x: 6, tile_y: 6};
  pickups.map_data[2] = {type: pickups.DOUBLE_JUMP, room_x:2, room_y: 1, tile_x: 2, tile_y: 2};
  pickups.map_data[3] = {type: pickups.BATTERY, room_x:0, room_y: 1, tile_x: 3, tile_y: 6};
  pickups.map_data[4] = {type: pickups.BATTERY, room_x:7, room_y: 2, tile_x: 6, tile_y: 3};
  pickups.map_data[5] = {type: pickups.DRILL, room_x:5, room_y: 0, tile_x: 2, tile_y: 5};
  pickups.map_data[6] = {type: pickups.BOOSTER, room_x:5, room_y: 2, tile_x: 1, tile_y: 4};
  pickups.map_data[7] = {type: pickups.MINIMAP, room_x:1, room_y: 0, tile_x: 4, tile_y: 6};

}

/**
 Place a single item on the map and mark it as not yet picked up
 */
pickups.add = function(type_id, room_x, room_y, tile_x, tile_y) {
  pickups.map_data.push({type: type_id, room_x: room_x, room_y: room_y, tile_x: tile_x, tile_y: tile_y});
  var new_id = pickups.map_data.length -1;
  pickups.collected[new_id] = false;  
}

pickups.clear_all = function() {
  pickups.map_data = [];
  pickups.collected = [];  
}

pickups.logic = function() {

  // animate
  pickups.current_frame += 0.2;
  if (pickups.current_frame >= pickups.frame_count) {
    pickups.current_frame = 0;
  }
  
  pickups.check_pickup(rover.get_collision_box());
}

pickups.check_pickup = function(rover_cbox) {
  
  // skip if no item on this screen
  if (!pickups.on_screen.available) return;
  
  var item_cbox = {x: pickups.on_screen.x, y: pickups.on_screen.y, w: pickups.size, h: pickups.size};
  
  if (collision.rectsOverlap(rover_cbox, item_cbox)) {
    
    pickups.on_screen.available = false;
    pickups.collected[pickups.on_screen.index] = true;
    
    // set new abilities in powerups object
    if (pickups.on_screen.type == pickups.BATTERY) {
      battery.add_capacity(2);	  
    }
    else if (pickups.on_screen.type == pickups.JUMP) {
      powerups.acquire_jump(); 
    }
    else if (pickups.on_screen.type == pickups.DOUBLE_JUMP) {
      powerups.acquire_doublejump(); 
    }
    else if (pickups.on_screen.type == pickups.BOOSTER) {
      powerups.acquire_booster(); 
    }
    else if (pickups.on_screen.type == pickups.DRILL) {
      powerups.acquire_drill(); 
    }
	else if (pickups.on_screen.type == pickups.MINIMAP) {
	  minimap.unlocked = true;
	}
	
	messages.set_message(pickups.info[pickups.on_screen.type].name);
	
    // visual effects
    particles.preset_smoke_area(item_cbox, 5);
    
  }
  
}

pickups.load_room = function(room_x, room_y) {
  
  for (var i=0; i<pickups.map_data.length; i++) {
    
    // is this pickup in this room?
    if (room_x == pickups.map_data[i].room_x && room_y == pickups.map_data[i].room_y) {
      if (pickups.collected[i] == false) {        
        pickups.on_screen.available = true;
        pickups.on_screen.type = pickups.map_data[i].type;
        pickups.on_screen.x = pickups.map_data[i].tile_x * tileset.tile_size;
        pickups.on_screen.y = pickups.map_data[i].tile_y * tileset.tile_size;
        pickups.on_screen.index = i;

        return;        
      }      
    }    
  }
  
  // nothing found? then no item in this room
  pickups.on_screen.available = false;
  
}

pickups.render = function() {
   if (pickups.on_screen.available) {
     pickups.render_icon(pickups.on_screen.type, pickups.on_screen.x, pickups.on_screen.y);
   }
}

pickups.render_icon = function(pickup_type, x, y) {
  
  var frame_number = Math.floor(pickups.current_frame);
  var src_x = pickups.info[pickup_type].frames[frame_number].x;
  var src_y = pickups.info[pickup_type].frames[frame_number].y;
  
  imageset.render(pickups.img, src_x, src_y, pickups.size, pickups.size, x, y);
}
