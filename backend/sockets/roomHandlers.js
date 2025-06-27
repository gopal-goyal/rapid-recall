const {
  getRoom,
  createRoom,
  deleteRoom,
  getAllRooms,
} = require('../state/roomStore');

module.exports = function registerRoomHandlers(io, socket) {
  socket.on('join-room', ({ roomId, name }) => {
    let room = getRoom(roomId);

    if (!room) {
      room = createRoom(roomId, socket.id, name); // 👈 add name of first user
      console.log(`📦 Created new room: ${roomId}`);
    }

    // Remove existing user (in case of refresh or replay)
    room.players = room.players.filter(p => p.id !== socket.id);
    room.players.push({ id: socket.id, name });

    socket.join(roomId);

    // ✅ Send host info and updated player list
    io.to(roomId).emit('host-id', room.hostId);
    io.to(roomId).emit('room-update', room.players);

    // ✅ Send room-state to just this socket (important!)
    io.to(socket.id).emit('room-state', {
      players: room.players,
      hostId: room.hostId,
      settings: room.gameState.settings,
      teams: room.gameState.teams,
    });
  });


  socket.on('disconnect', () => {
    const allRooms = getAllRooms();

    for (const roomId in allRooms) {
      const room = allRooms[roomId];
      const wasHost = room.hostId === socket.id;

      // Remove player
      room.players = room.players.filter(p => p.id !== socket.id);

      if (room.players.length === 0) {
        deleteRoom(roomId);
        console.log(`🧹 Room ${roomId} deleted`);
      } else {
        if (wasHost) {
          room.hostId = room.players[0].id;
          io.to(roomId).emit('host-id', room.hostId);
          console.log(`👑 Host reassigned to ${room.hostId}`);
        }

        io.to(roomId).emit('room-update', room.players);
      }
    }
  });
};
