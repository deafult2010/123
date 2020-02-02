// module aliases
var Engine = Matter.Engine,
  //   Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies;

var engine;
var world;
var circles = [];
var boxes = [];
var boundaries = [];

function setup() {
  createCanvas(400, 400);

  engine = Engine.create();
  world = engine.world;
  // Use update engine in draw function instead.
  //   Engine.run(engine);
  var options = {
    isStatic: true
  };
  boundaries.push(new Boundary(150, 100, width * 0.5, 20, 0.3));
  boundaries.push(new Boundary(250, 300, width * 0.5, 20, -0.3));
  //   World.add(world, ground);
}

// function mousePressed() {
function abcdef() {
  // if (mouseButton === RIGHT) {
  if (mouseIsPressed) {
    boxes.push(new Box(mouseX, mouseY, 20, 20));
  }
  if (mouseButton === LEFT) {
    circles.push(new Circle(mouseX, mouseY, random(5, 10)));
  }
}

function draw() {
  background(51);
  Engine.update(engine);
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].show();
    if (boxes[i].isOffScreen()) {
      boxes[i].removeFromWorld();
      boxes.splice(i, 1);
      i--;
    }
  }
  if (mouseIsPressed) {
    abcdef();
  }
  for (var i = 0; i < circles.length; i++) {
    circles[i].show();
    if (circles[i].isOffScreen()) {
      circles[i].removeFromWorld();
      circles.splice(i, 1);
      i--;
    }
  }
  for (var i = 0; i < boundaries.length; i++) {
    boundaries[i].show();
  }

  console.log(circles.length + boxes.length, world.bodies.length);
}
