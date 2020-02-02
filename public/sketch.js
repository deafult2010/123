var socket;

var blob;

var blobs = [];
var zoom = 1;

function setup() {
  createCanvas(600, 600);

  socket = io.connect('http://localhost:3000');

  blob = new Blob(random(width), random(height), random(8, 24));
  // for (var i = 0; i < 100; i++) {
  //   var x = random(-width, width);
  //   var y = random(-height, height);
  //   blobs[i] = new Blob(x, y, 16);
  // }

  console.log('Sending: ' + mouseX + ',' + mouseY);

  var data = {
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r
  };
  socket.emit('start', data);

  socket.on('heartbeat', function(data) {
    blobs = data;
  });

  // var elementPos = blobs
  //   .map(function(x) {
  //     return x.id;
  //   })
  //   .indexOf(socket.id);

  // console.log(elementPos);
  socket.on('disconnect', function() {
    console.log('Client has disconnected');
    // blobs.splice(elementPos, 1);
    // console.log(blobs);
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
      // blobs[i].show();
      // if (blob.eats(blobs[i])) {
      //   blobs.splice(i, 1);
      // }
    }
  }

  blob.show();
  if (mouseIsPressed) {
    blob.update();
  }
  blob.constrain();

  var data = {
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r
  };
  socket.emit('update', data);

  var elementPos = blobs
    .map(function(x) {
      return x.id;
    })
    .indexOf(socket.id);

  // console.log(blobs);
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
