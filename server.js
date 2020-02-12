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
const abcd = socket(server);

setInterval(heartbeat, 1);
function heartbeat() {
  abcd.sockets.emit('heartbeat', blobs, foods);
}

abcd.sockets.on('connection', newConnection);

function newConnection(socket) {
  socket.on('mouse', mouseMsg);

  function mouseMsg(data) {
    socket.broadcast.emit('mouse', data);
  }

  socket.on('start', function(data) {
    var blob = new Blob(socket.id, data.x, data.y, data.r);
    blobs.push(blob);
  });

  socket.on('initFood', function(dataF) {
    var food = new Food(dataF.x, dataF.y, dataF.r);
    foods.push(food);
  });

  socket.on('eaten', function(data3, abc) {
    if (data3 != null) {
      // var blobEat = socket.id + ' ' + data3;
      // console.log(blobEat);
      // blobs.splice(data3, 1);
      var elementPos = blobs
        .map(function(x) {
          return x.id;
        })
        .indexOf(data3);
      console.log('Client has disconnected ' + socket.id);
      console.log(blobs);
      if (elementPos > -1) {
        blobs.splice(elementPos, 1);
      }
      data3 = null;
      abc(data3);
    }
  });

  socket.on('update', function(data, data2) {
    var blob;

    for (var i = blobs.length - 1; i >= 0; i--) {
      if (socket.id == blobs[i].id) {
        blob = blobs[i];
      }
    }

    try {
      blob.x = data.x;
      blob.y = data.y;
      blob.r = data.r;
    } catch (err) {
      // console.log(err);
    }

    if (data2 != null) {
      // console.log(socket.id + ' ' + data2);
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
    console.log('Client has disconnected ' + socket.id);
    console.log(blobs);
    if (elementPos > -1) {
      blobs.splice(elementPos, 1);
    }
  });
}
