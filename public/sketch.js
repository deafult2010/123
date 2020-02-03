var socket;

var blob;
var food;

var Nfoods = [];
var foods = [];
var blobs = [];
var zoom = 1;

function setup() {
  createCanvas(600, 600);

  socket = io.connect('http://localhost:3000');

  blob = new Blob(random(width), random(height), random(8, 24));
  for (var i = 0; i < 10; i++) {
    var x = random(-width, width);
    var y = random(-height, height);
    Nfoods[i] = new Food(x, y, 10);
    var dataF = {
      x: Nfoods[i].pos.x,
      y: Nfoods[i].pos.y,
      r: Nfoods[i].r
    };
    socket.emit('initFood', dataF);
  }

  food = new Food(random(width), random(height), 10);

  var data = {
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r
  };

  socket.emit('start', data);

  socket.on('heartbeat', function(data, data2) {
    blobs = data;
    foods = data2;
  });

  //disables "context menu" on right click for the canvas
  canvas.oncontextmenu = function(e) {
    e.preventDefault();
  };
}

function draw() {
  background(51);

  translate(width / 2, height / 2);
  newzoom = 64 / blob.r;
  zoom = lerp(zoom, newzoom, 0.05);
  scale(zoom);
  translate(-blob.pos.x, -blob.pos.y);

  for (var i = blobs.length - 1; i >= 0; i--) {
    var id = blobs[i].id;
    if (id !== socket.id) {
      fill(0, 0, 255);
      ellipse(blobs[i].x, blobs[i].y, blobs[i].r * 2, blobs[i].r * 2);

      fill(255);
      textAlign(CENTER);
      textSize(4);
      text(blobs[i].id, blobs[i].x, blobs[i].y + blobs[i].r * 1.5);
    }
  }

  for (var i = foods.length - 1; i >= 0; i--) {
    fill(255, 0, 0);
    ellipse(foods[i].x, foods[i].y, foods[i].r);

    if (blob.eats(foods[i])) {
      var data2 = i;
      foods.splice(i, 1);
    }
  }

  var color = [255, 255, 255];
  blob.show(color);
  if (mouseIsPressed) {
    blob.update();
  }
  blob.constrain();

  var data = {
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r
  };
  socket.emit('update', data, data2);

  data2 = null;
}

// if (document.addEventListener) {
//   document.addEventListener(
//     'contextmenu',
//     function(e) {
//       alert("You've tried to open context menu"); //here you draw your own menu
//       e.preventDefault();
//     },
//     false
//   );
// } else {
//   document.attachEvent('oncontextmenu', function() {
//     alert("You've tried to open context menu");
//     window.event.returnValue = false;
//   });
// }
