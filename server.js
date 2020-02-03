var foods = [];
var blobs = [];

function Blob(id, x, y, r) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = r;
}

function Food(x, y, r) {
  this.x = x;
  this.y = y;
  this.r = r;
}

const express = require('express');
const app = express();
const server = app.listen(3000);

app.use(express.static('public'));

console.log('my socket server is running');

const socket = require('socket.io');
const io = socket(server);

setInterval(heartbeat, 33);
function heartbeat() {
  io.sockets.emit('heartbeat', blobs, foods);
}

io.sockets.on('connection', newConnection);

function newConnection(socket) {
  socket.on('start', function(data) {
    var blob = new Blob(socket.id, data.x, data.y, data.r);
    blobs.push(blob);
  });

  socket.on('initFood', function(dataF) {
    var food = new Food(dataF.x, dataF.y, dataF.r);
    foods.push(food);
  });

  socket.on('update', function(data, data2) {
    var blob;
    for (var i = 0; i < blobs.length; i++) {
      if (socket.id == blobs[i].id) {
        blob = blobs[i];
      }
    }

    blob.x = data.x;
    blob.y = data.y;
    blob.r = data.r;

    if (data2 != null) {
      foods.splice(data2, 1);
      data2 = null;
    }
  });

  socket.on('disconnect', function() {
    var elementPos = blobs
      .map(function(x) {
        return x.id;
      })
      .indexOf(socket.id);
    console.log('Client has disconnected' + socket.id);
    blobs.splice(elementPos, 1);
    console.log(blobs);
  });
}
