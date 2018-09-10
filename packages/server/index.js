const ejs = require('ejs');
const http = require('http');
const express = require('express');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 8080;

app.engine('html', ejs.renderFile);
app.use(express.static(__dirname + '/dist'));

app.get('/', function (req, res) {
  res.render(path.join(__dirname + '/views/index.html'))
});

io.on('connection', function (socket) {
  const room = socket.handshake.query.token || socket.id;

  socket.join(room);

  socket.on('message', (data) => {
    socket.broadcast.to(room).emit('message', data)
  })

  socket.on('disconnect', () => {
    socket.leave(room)
  })
});

server.listen(PORT, function () {
  console.log(`Server run on port ${PORT}`)
});