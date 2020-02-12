var socket;
var inGame;
var initClick;
var countDwn = 0;

var blob;
var food;
var startBtn;

var Nfoods = [];
var foods = [];
var blobs = [];
var zoom = 1;

function setup() {
  createCanvas(600, 600);
  startBtn = new StartBtn(100, 200, 150, 50);
  //disables "context menu" on right click for the canvas
  canvas.oncontextmenu = function(e) {
    e.preventDefault();
  };
}

function startGame() {
  blobs = [];
  socket = io.connect('http://localhost:3000');

  blob = new Blob(random(width), random(height), random(15, 24));
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

  initClick = false;
}

function mousePressed() {
  startBtn.clicked();
  if (!inGame && initClick) {
    inGame = true;
    startGame();
  }
}

function draw() {
  background(51);

  if (inGame) {
    push();

    translate(width / 2, height / 2);
    newzoom = 64 / blob.r;
    zoom = lerp(zoom, newzoom, 0.05);
    scale(zoom);
    translate(-blob.pos.x, -blob.pos.y);

    for (var i = blobs.length - 1; i >= 0; i--) {
      var id = blobs[i].id;
      if (id !== socket.id) {
        if (blobs[i].r > blob.r) {
          fill(0, 0, 255);
        } else {
          fill(0, 255, 0);
        }
        ellipse(blobs[i].x, blobs[i].y, blobs[i].r * 2, blobs[i].r * 2);

        fill(255);
        textAlign(CENTER);
        textSize(4);
        text(blobs[i].id, blobs[i].x, blobs[i].y + blobs[i].r * 1.5);

        // New code:
        if (blob.eats(blobs[i])) {
          // blobs.splice(i, 1);
          var data3 = blobs[i].id;
          socket.emit('eaten', data3, function(abc) {
            data3 = abc;
          });
        }
      }
      if (blob.eaten(blobs[i])) {
        inGame = false;
        socket.disconnect();
        countDwn = 0;
        console.log('eaten by ' + i);
        console.log('disconecting socket...');
        return;
      }
    }
    // if (data3 > -1) {
    //   blobs.splice(data3, 1);
    // }

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
    pop();

    //score
    fill(0);
    rect(0, 0, 100, 100);
    textAlign(CENTER);
    textSize(18);
    fill(255);
    text('score', 50, 30);
    text(blob.counter(), 50, 70);

    //chat
    fill(130);
    rect(0, 500, 600, 100);
    fill(120);
    rect(0, 580, 600, 20);
    fill(0, 80, 0);
    textSize(10);
    textAlign(LEFT);
    textStyle(BOLD);
    text('Blob1: This area is for the chats :)', 10, 515);
    text('Blob2: Hello World', 10, 535);
    text('Blob3: Whats up?', 10, 555);
    text('Blob4: Hi there', 10, 575);
    fill(80, 80, 80);
    textStyle(ITALIC);
    text('Blob5: Type message...', 10, 595);

    //minimap
    fill(100);
    rect(400, 0, 200, 100);

    var elementPos = blobs
      .map(function(x) {
        return x.id;
      })
      .indexOf(socket.id);

    if (elementPos == -1 && inGame) {
      console.log(elementPos);
      countDwn++;
      console.log(countDwn);
      if (countDwn > 10) {
        inGame = false;
        socket.disconnect();
        countDwn = 0;
      }
    }
  } else {
    startBtn.show();
  }
}
