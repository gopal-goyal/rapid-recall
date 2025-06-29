const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');
const registerSocketHandlers = require('./sockets');

const app = express();
const server = http.createServer(app);

// Serve static frontend files
const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientBuildPath));

// Fallback: serve index.html for all other routes (for React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Set up Socket.IO
const io = new Server(server, {
  cors: { origin: '*' }
});
registerSocketHandlers(io);

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server listening!`);
});
