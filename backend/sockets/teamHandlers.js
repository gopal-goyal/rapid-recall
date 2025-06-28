const { getRoom, updateRoom } = require('../state/roomStore');

module.exports = function registerTeamHandlers(io, socket) {
  socket.on('teams-updated', ({ roomId, teams }) => {
    const room = getRoom(roomId);
    const player = room.players.find(p => p.socketId === socket.id);
    if (!player || player.playerId !== room.hostId) return;


    const currentPlayerIds = new Set(room.players.map(p => p.playerId));

    const isValid = team => Array.isArray(team) && team.every(p => currentPlayerIds.has(p.playerId));
    if (!isValid(teams.A) || !isValid(teams.B)) return;

    updateRoom(roomId, room => {
      room.gameState.teams = { A: teams.A, B: teams.B };
    });

    io.to(roomId).emit('teams-updated', { teams });
  });
};
