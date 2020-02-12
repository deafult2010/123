var socket;

function setup() {
  createCanvas(400, 400);
  background(51);
  frameRate(24);

  socket = io.connect('http://localhost:3000');
  socket.on('mouse', newDrawing);
}

function newDrawing(data) {
  noStroke();
  fill(0, 255, 0);
  ellipse(data.x, data.y, 50, 50);

  noStroke();
  fill(255, 0, 100);
  ellipse(data.x, data.y, 30, 30);
}

function mouseDragged() {
  console.log('Sending: ' + mouseX + ',' + mouseY);

  var data = {
    x: mouseX,
    y: mouseY
  };
  socket.emit('mouse', data);

  noStroke();
  fill(255);
  ellipse(mouseX, mouseY, 50, 50);
}
