const {
  getRoom,
  createRoom,
  deleteRoom,
  getAllRooms,
} = require('../state/roomStore');
const { v4: uuidv4 } = require('uuid');

module.exports = function registerRoomHandlers(io, socket) {

  // Check if room exists
  socket.on('check-room-exists', ({ roomId }) => {
  const room = getRoom(roomId);
  socket.emit('room-exists-response', { exists: !!room });
  });
  
  // CREATE ROOM
  socket.on('create-room', ({ name }) => {
    const roomId = uuidv4().slice(0, 6); // Generate a short room ID
    const playerId = uuidv4(); // Generate a unique player ID
    const room = createRoom(roomId, socket.id , playerId, name);

    socket.join(roomId);

    io.to(socket.id).emit('room-created', {
      roomId,
      playerId,
      hostId: room.hostId,
    });

    io.to(socket.id).emit('room-state', {
      players: room.players,
      hostId: room.hostId,
      settings: room.gameState?.settings,
      teams: room.gameState?.teams || { A: [], B: [] },
    });
  });

  // JOIN ROOM
  socket.on('join-room', ({ name, playerId, roomId }) => {
    const room = getRoom(roomId);
    console.log(`room details:`, room);
    if (!room) {
      io.to(socket.id).emit('join-error', { message: 'Room not found.' });
      return;
    }

    let player =
      room.players.find(p => p.playerId === playerId) ||
      room.disconnectedPlayers.find(p => p.playerId === playerId);

    if (player) {
      // 🧠 Reconnect: update socketId and name
      player.socketId = socket.id;
      player.name = name;

      // ♻️ If coming from disconnected list, restore to active players
      if (!room.players.includes(player)) {
        room.disconnectedPlayers = room.disconnectedPlayers.filter(p => p.playerId !== playerId);
        room.players.push(player);
      }
    } else {
      // 🆕 New player
      playerId = playerId || uuidv4();
      player = { playerId, socketId: socket.id, name };
      room.players.push(player);
    }


    socket.join(roomId);

    io.to(socket.id).emit('room-joined', {
      roomId,
      playerId,
      hostId: room.hostId,
    });

    io.to(roomId).emit('room-state', {
      players: room.players,
      hostId: room.hostId,
      settings: room.gameState?.settings,
      teams: room.gameState?.teams || { A: [], B: [] },
    });
  });

  // ✅ HANDLE DISCONNECT
  socket.on('disconnect', () => {
    const allRooms = getAllRooms();

    for (const roomId in allRooms) {
      const room = allRooms[roomId];

      // 🔍 Find the disconnecting player by their socketId
      const player = room.players.find(p => p.socketId === socket.id);

      if (!player) continue; // No match in this room

      const wasHost = room.hostId === player.playerId;

      // Remove the player using playerId and add to disconnectedPlayers
      room.disconnectedPlayers.push(player);
      room.players = room.players.filter(p => p.playerId !== player.playerId);
      console.log(`room details after deletion:`, room);

      // 🧹 If room is empty, delete it
      if (room.players.length === 0) {
        console.log(`⌛ Room ${roomId} is now empty. Scheduling deletion...`);
        setTimeout(() => {
          const latestRoom = getRoom(roomId);
          if (latestRoom && latestRoom.players.length === 0) {
            deleteRoom(roomId);
            console.log(`🧹 Room ${roomId} deleted after timeout`);
          }
        }, 60000); // 60 seconds grace period
      }

      // 👑 Reassign host if necessary
      if (wasHost && room.players.length > 0) {
        room.hostId = room.players[0].playerId;
        io.to(roomId).emit('room-state', {
          players: room.players,
          hostId: room.hostId,
          settings: room.gameState?.settings,
          teams: room.gameState?.teams || { A: [], B: [] },
        });
        console.log(`👑 Host reassigned to ${room.hostId}`);
      }
    }
  });
};

