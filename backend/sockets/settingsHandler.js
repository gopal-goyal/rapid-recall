const { getRoom, updateRoom } = require('../state/roomStore');

module.exports = function registerSettingsHandlers(io, socket) {
  socket.on('settings-updated', ({ roomId, settings }) => {
    const room = getRoom(roomId);

    if (!room) return;
    if (socket.id !== room.hostId) return;

    const validKeys = ['wordsPerRound', 'timePerTurn', 'pointsToWin'];

    // Validate settings payload
    if (
      typeof settings !== 'object' ||
      Object.keys(settings).some(key => !validKeys.includes(key))
    ) {
      console.warn(`⚠️ Invalid settings update from ${socket.id}`);
      return;
    }

    // Apply update
    updateRoom(roomId, (room) => {
      if (!room.gameState) room.gameState = {};
      if (!room.gameState.settings) {
        room.gameState.settings = {
          wordsPerRound: 5,
          timePerTurn: 60,
          pointsToWin: 10,
        };
      }

      Object.assign(room.gameState.settings, settings);
    });

    // Emit new settings to everyone in room
    io.to(roomId).emit('settings-updated', { settings });
    console.log(`⚙️ Game settings updated in room ${roomId}:`, settings);
  });
};
