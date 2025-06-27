// File: server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // In dev only; restrict this later in prod
  }
});

const rooms = {};

io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  socket.on('join-room', ({ roomId, name }) => {
    socket.join(roomId); // Add socket to the room

    // Initialize room if it doesn't exist
    if (!rooms[roomId]) {
      rooms[roomId] = [];
      console.log(`📦 Created new room: ${roomId}`);
    }

    // Remove old entry if same socket.id already exists (prevent duplication)
    rooms[roomId] = rooms[roomId].filter((user) => user.id !== socket.id);

    // Add new player
    rooms[roomId].push({ id: socket.id, name });

    console.log('👥 Room', roomId, 'players:', rooms[roomId]);

    // Broadcast the updated room to everyone (including the joining player)
    io.to(roomId).emit('room-update', rooms[roomId]);
  });

  socket.on('disconnect', () => {
    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter((user) => user.id !== socket.id);

      // Clean up empty rooms (optional)
      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
        console.log(`🧹 Room ${roomId} deleted`);
      } else {
        io.to(roomId).emit('room-update', rooms[roomId]);
      }
    }
  });
});

server.listen(3001, () => {
  console.log('🚀 Server listening on http://localhost:3001');
});
