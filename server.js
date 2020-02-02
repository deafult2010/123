var blobs = [];

function Blob(id, x, y, r) {
  this.id = id;
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
  io.sockets.emit('heartbeat', blobs);
}

io.sockets.on('connection', newConnection);

function newConnection(socket) {
  console.log('new connection: ' + socket.id);

  socket.on('start', function(data) {
    console.log(socket.id + ' ' + data.x + ' ' + data.y + ' ' + data.r);

    var blob = new Blob(socket.id, data.x, data.y, data.r);
    blobs.push(blob);
  });

  socket.on('update', function(data) {
    console.log(socket.id + ' ' + data.x + ' ' + data.y + ' ' + data.r);

    var blob;
    for (var i = 0; i < blobs.length; i++) {
      if (socket.id == blobs[i].id) {
        blob = blobs[i];
      }
    }

    console.log(blob);

    blob.x = data.x;
    blob.y = data.y;
    blob.r = data.r;

    // var blob = new Blob(socket.id, data.x, data.y, data.r);
    // blobs.push(blob);
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
