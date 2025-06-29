const { getRoom, updateRoom } = require('../state/roomStore');

module.exports = function registerSettingsHandlers(io, socket) {
  socket.on('settings-updated', ({ roomId, settings }) => {
    const room = getRoom(roomId);
    const player = room.players.find(p => p.socketId === socket.id);
    if (!player || player.playerId !== room.hostId) return;

    // Define allowed settings and their expected types
    const allowedSettings = {
      wordsPerRound: 'number',
      timePerTurn: 'number',
      pointsToWin: 'number',
      includeNsfw: 'boolean',
    };

    // Sanitize input based on type
    const sanitized = {};
    for (const [key, expectedType] of Object.entries(allowedSettings)) {
      if (typeof settings[key] === expectedType) {
        sanitized[key] = settings[key];
      }
    }

    // Update room settings
    updateRoom(roomId, room => {
      room.gameState.settings = { ...room.gameState.settings, ...sanitized };
    });

    // Emit full updated settings to everyone
    io.to(roomId).emit('settings-updated', {
      settings: getRoom(roomId).gameState.settings,
    });
  });
};
