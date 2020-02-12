function StartBtn(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.col = color(100, 100, 100);
  var click;

  this.overRect = function() {
    if (click) {
    } else {
      if (
        mouseX > this.x &&
        mouseX < this.x + this.w &&
        mouseY > this.y &&
        mouseY < this.y + this.h
      ) {
        this.col = color(200, 200, 200);
      } else {
        this.col = color(100, 100, 100);
      }
    }
  };

  this.show = function() {
    this.overRect();
    fill(this.col);
    rect(this.x, this.y, this.w, this.h);
    fill(0, 0, 0);
    text('Start Game', this.x + 50, this.y + 30);
  };

  this.clicked = function() {
    var dx = dist(mouseX, 0, this.x + this.w / 2, 0);
    var dy = dist(mouseY, 0, this.y + this.h / 2, 0);
    if (dx < this.w / 2 && dy < this.h / 2) {
      this.col = color(250, 250, 250);
      click = true;
      initClick = true;
    }
  };
}
