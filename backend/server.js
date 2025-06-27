const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const registerSocketHandlers = require('./sockets');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*' }
});

registerSocketHandlers(io);

server.listen(3001, () => {
  console.log('🚀 Server listening on http://localhost:3001');
});