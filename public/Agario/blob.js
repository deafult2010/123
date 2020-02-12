function Blob(x, y, r) {
  this.pos = createVector(x, y);
  this.r = r;
  this.vel = createVector(0, 0);

  this.update = function() {
    var newvel = createVector(mouseX - width / 2, mouseY - height / 2);
    // vel.sub(this.pos);
    newvel.setMag((abs(mouseX - width / 2) + abs(mouseY - height / 2)) / 100);
    this.vel.lerp(newvel, 0.05);
    this.pos.add(this.vel);
  };

  this.eats = function(other) {
    other.pos = createVector(other.x, other.y);
    var d = p5.Vector.dist(this.pos, other.pos);
    if (d < this.r + other.r && this.r > other.r) {
      var sum = PI * this.r * this.r + PI * other.r * other.r;
      this.r = sqrt(sum / PI);
      return true;
    } else {
      return false;
    }
  };

  this.eaten = function(other) {
    other.pos = createVector(other.x, other.y);
    var d = p5.Vector.dist(this.pos, other.pos);
    if (d < this.r + other.r && this.r < other.r) {
      return true;
    } else {
      return false;
    }
  };

  this.constrain = function() {
    blob.pos.x = constrain(blob.pos.x, -width, width);
    blob.pos.y = constrain(blob.pos.y, -height, height);
  };

  this.show = function(color) {
    fill(color);
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  };

  this.counter = function() {
    return Math.round(blob.r);
  };
}
