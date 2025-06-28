const { getRoom, updateRoom } = require('../state/roomStore');

module.exports = function registerSettingsHandlers(io, socket) {
  socket.on('settings-updated', ({ roomId, settings }) => {
    const room = getRoom(roomId);
    const player = room.players.find(p => p.socketId === socket.id);
    if (!player || player.playerId !== room.hostId) return;


    const validKeys = ['wordsPerRound', 'timePerTurn', 'pointsToWin'];
    const sanitized = Object.fromEntries(
      Object.entries(settings).filter(([k, v]) => validKeys.includes(k) && typeof v === 'number')
    );

    updateRoom(roomId, room => {
      room.gameState.settings = { ...room.gameState.settings, ...sanitized };
    });

    io.to(roomId).emit('settings-updated', { settings: sanitized });
  });
};
